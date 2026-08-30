from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_doctor_cannot_access_ai_assistant_endpoint():
    response = client.post(
        "/api/ai/assistant",
        json={"question": "Need triage guidance"},
        headers={"X-User-Role": "doctor"},
    )
    assert response.status_code == 403, response.text
    assert "Forbidden" in response.json()["detail"]


def test_admin_can_access_ai_assistant_endpoint():
    response = client.post(
        "/api/ai/assistant",
        json={"question": "Need triage guidance"},
        headers={"X-User-Role": "admin"},
    )
    assert response.status_code == 200, response.text
    assert "answer" in response.json()
