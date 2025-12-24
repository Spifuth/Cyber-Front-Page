"""Tests for API endpoints."""
import os
from datetime import datetime
from fastapi.testclient import TestClient
from backend.server import app, memory_status_checks, rate_limit_store


client = TestClient(app)
TRUSTED_ORIGIN = os.getenv("TRUSTED_ORIGINS", "http://localhost:5173").split(",")[0].strip()


def setup_function():
    """Clear stores before each test."""
    memory_status_checks.clear()
    rate_limit_store.clear()


def test_root_endpoint():
    """Test the root API endpoint returns hello world."""
    response = client.get("/api/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}


def test_healthcheck_endpoint():
    """Test the healthcheck endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "database" in data
    assert data["status"] == "ok"
    assert data["database"] in ["connected", "offline"]


def test_create_status_check_success():
    """Test creating a valid status check."""
    payload = {"client_name": "test-client"}
    response = client.post("/api/status", json=payload)
    
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["client_name"] == "test-client"
    assert "timestamp" in data
    # Verify timestamp format
    datetime.fromisoformat(data["timestamp"].replace("Z", "+00:00"))


def test_create_status_check_strips_whitespace():
    """Test that client_name whitespace is stripped."""
    payload = {"client_name": "  test-client  "}
    response = client.post("/api/status", json=payload)
    
    assert response.status_code == 201
    data = response.json()
    assert data["client_name"] == "test-client"


def test_create_status_check_empty_name():
    """Test that empty client_name is rejected."""
    payload = {"client_name": ""}
    response = client.post("/api/status", json=payload)
    
    assert response.status_code == 422  # Unprocessable Entity


def test_create_status_check_whitespace_only():
    """Test that whitespace-only client_name is rejected."""
    payload = {"client_name": "   "}
    response = client.post("/api/status", json=payload)
    
    assert response.status_code == 422


def test_create_status_check_too_long():
    """Test that client_name exceeding max length is rejected."""
    payload = {"client_name": "x" * 129}  # Max is 128
    response = client.post("/api/status", json=payload)
    
    assert response.status_code == 422


def test_create_status_check_missing_field():
    """Test that missing client_name is rejected."""
    payload = {}
    response = client.post("/api/status", json=payload)
    
    assert response.status_code == 422


def test_get_status_checks_empty():
    """Test getting status checks when none exist."""
    response = client.get("/api/status")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0


def test_get_status_checks_returns_created():
    """Test that created status checks can be retrieved."""
    # Create a status check
    payload = {"client_name": "test-client"}
    create_response = client.post("/api/status", json=payload)
    assert create_response.status_code == 201
    created_id = create_response.json()["id"]
    
    # Retrieve status checks
    get_response = client.get("/api/status")
    assert get_response.status_code == 200
    data = get_response.json()
    assert len(data) == 1
    assert data[0]["id"] == created_id
    assert data[0]["client_name"] == "test-client"


def test_memory_store_limit():
    """Test that in-memory store is limited to 100 items."""
    # Create 110 status checks
    for i in range(110):
        payload = {"client_name": f"client-{i}"}
        response = client.post("/api/status", json=payload)
        assert response.status_code == 201
    
    # Verify memory store is limited to 100
    assert len(memory_status_checks) == 100
    
    # Verify oldest items were removed (first 10)
    client_names = [item["client_name"] for item in memory_status_checks]
    assert "client-0" not in client_names
    assert "client-9" not in client_names
    assert "client-10" in client_names
    assert "client-109" in client_names


def test_get_status_checks_order():
    """Test that status checks are returned in reverse chronological order."""
    # Create multiple status checks
    for i in range(3):
        payload = {"client_name": f"client-{i}"}
        response = client.post("/api/status", json=payload)
        assert response.status_code == 201
    
    # Get status checks
    response = client.get("/api/status")
    assert response.status_code == 200
    data = response.json()
    
    # Verify order (most recent first)
    assert len(data) == 3
    assert data[0]["client_name"] == "client-2"
    assert data[1]["client_name"] == "client-1"
    assert data[2]["client_name"] == "client-0"


def test_status_check_id_uniqueness():
    """Test that each status check gets a unique ID."""
    ids = set()
    for i in range(10):
        payload = {"client_name": f"client-{i}"}
        response = client.post("/api/status", json=payload)
        assert response.status_code == 201
        data = response.json()
        ids.add(data["id"])
    
    # All IDs should be unique
    assert len(ids) == 10


# Security tests

def test_create_status_check_invalid_characters():
    """Test that client_name with invalid characters is rejected."""
    invalid_names = [
        "<script>alert('xss')</script>",
        "client;DROP TABLE users;",
        "client$(whoami)",
        "client`id`",
        "client\x00null",
    ]
    for name in invalid_names:
        payload = {"client_name": name}
        response = client.post("/api/status", json=payload)
        assert response.status_code == 422, f"Expected 422 for name: {name}"


def test_create_status_check_valid_special_characters():
    """Test that client_name with valid special characters is accepted."""
    valid_names = [
        "test-client",
        "test_client",
        "test.client",
        "Test Client",
        "client123",
        "Ñoño Español",  # Unicode letters
    ]
    for name in valid_names:
        payload = {"client_name": name}
        response = client.post("/api/status", json=payload)
        assert response.status_code == 201, f"Expected 201 for name: {name}"


def test_rate_limiting():
    """Test that rate limiting is enforced."""
    from backend.server import RATE_LIMIT_REQUESTS
    
    # Make requests up to the limit
    for i in range(RATE_LIMIT_REQUESTS):
        payload = {"client_name": f"client-{i}"}
        response = client.post("/api/status", json=payload)
        assert response.status_code == 201, f"Request {i+1} should succeed"
    
    # Next request should be rate limited
    payload = {"client_name": "one-too-many"}
    response = client.post("/api/status", json=payload)
    assert response.status_code == 429
    assert "rate limit" in response.json()["detail"].lower()


def test_cors_methods_restricted():
    """Test that only allowed HTTP methods work."""
    # DELETE should not be allowed (we only allow GET, POST, OPTIONS)
    response = client.delete("/api/status")
    assert response.status_code == 405  # Method Not Allowed
