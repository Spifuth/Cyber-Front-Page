from fastapi.testclient import TestClient
from backend.server import app


client = TestClient(app)

TRUSTED_ORIGIN = "https://29fdc702-5474-4256-aa98-eaa10f15092d.preview.emergentagent.com"


def test_cors_allows_trusted_origin():
    response = client.get("/api/", headers={"Origin": TRUSTED_ORIGIN})
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == TRUSTED_ORIGIN
    assert "access-control-allow-credentials" not in response.headers


def test_cors_blocks_untrusted_origin():
    response = client.get("/api/", headers={"Origin": "https://malicious.com"})
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") is None
    assert "access-control-allow-credentials" not in response.headers

