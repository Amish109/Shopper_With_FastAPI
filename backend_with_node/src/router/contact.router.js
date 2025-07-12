import { Router } from "express";
import { sendMessage } from "../controller/contact.controller.js";
const contactRouter=Router();

contactRouter.route("/sendMessage").post(sendMessage);

export default contactRouter