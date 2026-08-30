from fastapi import HTTPException, Request, status


def require_admin_role(request: Request):
    role = (request.headers.get("X-User-Role") or request.headers.get("x-user-role") or "").strip().lower()
    if role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: admin role required for AI administrative features."
        )
    return True
