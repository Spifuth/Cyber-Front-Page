"""Integration tests for database operations."""
import os
import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi.testclient import TestClient
from backend.server import app, save_status, fetch_statuses, StatusCheck, memory_status_checks, rate_limit_store
from datetime import datetime, timezone


client = TestClient(app)


def setup_function():
    """Clear stores before each test."""
    memory_status_checks.clear()
    rate_limit_store.clear()


@pytest.mark.asyncio
async def test_save_status_to_memory():
    """Test saving status to in-memory store."""
    from backend.server import status_collection
    
    # Ensure we're using memory store
    original_collection = status_collection
    
    try:
        # Force memory mode
        import backend.server
        backend.server.status_collection = None
        
        status = StatusCheck(client_name="test-client")
        result = await save_status(status)
        
        assert result.client_name == "test-client"
        assert len(memory_status_checks) == 1
        assert memory_status_checks[0]["client_name"] == "test-client"
    finally:
        backend.server.status_collection = original_collection


@pytest.mark.asyncio
async def test_fetch_statuses_from_memory():
    """Test fetching statuses from in-memory store."""
    import backend.server
    
    original_collection = backend.server.status_collection
    
    try:
        # Force memory mode
        backend.server.status_collection = None
        
        # Add test data
        status1 = StatusCheck(client_name="client-1")
        status2 = StatusCheck(client_name="client-2")
        await save_status(status1)
        await save_status(status2)
        
        # Fetch statuses
        statuses = await fetch_statuses()
        
        assert len(statuses) == 2
        # Should be in reverse order (most recent first)
        assert statuses[0].client_name == "client-2"
        assert statuses[1].client_name == "client-1"
    finally:
        backend.server.status_collection = original_collection


@pytest.mark.asyncio
async def test_save_status_with_mongodb():
    """Test saving status to MongoDB (mocked)."""
    mock_collection = AsyncMock()
    
    with patch('backend.server.status_collection', mock_collection):
        status = StatusCheck(client_name="test-mongo-client")
        result = await save_status(status)
        
        assert result.client_name == "test-mongo-client"
        mock_collection.insert_one.assert_called_once()


@pytest.mark.asyncio
async def test_fetch_statuses_with_mongodb():
    """Test fetching statuses from MongoDB (mocked)."""
    mock_collection = MagicMock()
    mock_cursor = AsyncMock()
    mock_cursor.to_list = AsyncMock(return_value=[
        {"id": "123", "client_name": "mongo-client-1", "timestamp": datetime.now(timezone.utc)},
        {"id": "456", "client_name": "mongo-client-2", "timestamp": datetime.now(timezone.utc)}
    ])
    mock_collection.find.return_value.sort.return_value = mock_cursor
    
    with patch('backend.server.status_collection', mock_collection):
        statuses = await fetch_statuses()
        
        assert len(statuses) == 2
        assert statuses[0].client_name == "mongo-client-1"
        assert statuses[1].client_name == "mongo-client-2"
        mock_collection.find.assert_called_once()


def test_api_endpoints_with_cors_headers():
    """Test that API endpoints respect CORS headers."""
    origin = os.getenv("TRUSTED_ORIGINS", "http://localhost:5173").split(",")[0].strip()
    
    # Test POST endpoint
    response = client.post(
        "/api/status",
        json={"client_name": "test"},
        headers={"Origin": origin}
    )
    assert response.status_code == 201
    assert response.headers.get("access-control-allow-origin") == origin
    
    # Test GET endpoint
    response = client.get("/api/status", headers={"Origin": origin})
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == origin


def test_healthcheck_database_status():
    """Test healthcheck reports correct database status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    
    # Database should be offline in test environment (no MongoDB)
    assert data["database"] == "offline"
    assert data["status"] == "ok"
