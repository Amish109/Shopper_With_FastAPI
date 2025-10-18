# https://chatgpt.com/share/68f3ef6b-7894-8003-af04-f1116ac2848f
# https://chatgpt.com/c/68f3f222-2ce8-8321-939d-961ca3aa4541
# responses.py
from pydantic import BaseModel
from typing import Any, Optional

class SuccessResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any]
    status: int

    def __init__(
        self,
        data: Any = None,
        message: str = "Success",
        status: int = 200,
        success: bool = True
    ):
        super().__init__(success=success, message=message, data=data, status=status)

# @app.get("/test")
# def test_route():
#     return SuccessResponse(data={"id": 1, "name": "Amish"}, message="Fetched successfully")
