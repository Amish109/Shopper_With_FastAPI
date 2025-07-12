import { Router } from "express";
import { signIn, signUp ,signOut,checkCode} from "../controller/user.controller.js";
import Authjs from "../middleware/authJWT.js";
const userRouter= Router();

userRouter.route("/sign-up").post(signUp);
userRouter.route("/sign-in").post(signIn);
userRouter.route("/sign-out").post(Authjs,signOut);
userRouter.route("/checkcookie").get(checkCode);

export {userRouter} 