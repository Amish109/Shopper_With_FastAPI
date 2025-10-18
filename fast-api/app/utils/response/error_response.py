# https://chatgpt.com/share/68f3ef6b-7894-8003-af04-f1116ac2848f
# https://chatgpt.com/c/68f3f222-2ce8-8321-939d-961ca3aa4541
# https://chatgpt.com/c/68f40c24-dc0c-8321-9977-b7ab010656e9
from fastapi import HTTPException
from typing import Any, Optional

class ErrorResponse(HTTPException):
    def __init__(
        self,
        message: str = "Error",
        status_code: int = 400,
        details: Optional[Any] = None,
    ):
        content = {
            "success": False,
            "message": message,
            "status": status_code,
            "details": details,
        }
        super().__init__(status_code=status_code, detail=content)


# @app.get("/test")
# def test_route():
#     return SuccessResponse(data={"id": 1, "name": "Amish"}, message="Fetched successfully")
