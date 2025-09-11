"""Pytest-based backend API tests."""

import pytest
import requests

from backend_test import get_backend_url


backend_url = get_backend_url()

if not backend_url:
    pytest.skip("Backend URL not configured", allow_module_level=True)


def test_backend_connectivity():
    """The root API endpoint should return a 200 and Hello World message."""
    resp = requests.get(f"{backend_url}/api/", timeout=10)
    assert resp.status_code == 200
    assert resp.json().get("message") == "Hello World"


def test_status_endpoints():
    """Status endpoints should allow creating and listing status checks."""
    payload = {"client_name": "pytest_client"}
    post_resp = requests.post(
        f"{backend_url}/api/status", json=payload, headers={"Content-Type": "application/json"}, timeout=10
    )
    assert post_resp.status_code == 200
    data = post_resp.json()
    for field in ["id", "client_name", "timestamp"]:
        assert field in data
    created_id = data["id"]

    get_resp = requests.get(f"{backend_url}/api/status", timeout=10)
    assert get_resp.status_code == 200
    get_data = get_resp.json()
    assert isinstance(get_data, list)
    assert any(item.get("id") == created_id for item in get_data)

