from fastapi import APIRouter, Depends
from app.controllers.user_controller import sign_up, sign_in, sign_out, check_cookie
from app.middleware.auth_jwt import verify_jwt

router = APIRouter(prefix="/api/user", tags=["User"])

router.post("/sign-up")(sign_up)
router.post("/sign-in")(sign_in)
router.post("/sign-out", dependencies=[Depends(verify_jwt)])(sign_out)
router.get("/checkcookie")(check_cookie)
