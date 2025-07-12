import { Router } from "express";
import Authjs from "../middleware/authJWT.js";
import { addProduct,removeproduct,addToCart, getAllProducts, newcollection, popularInWomen,getCart,removeCart,uploadProduct } from "../controller/product.js";
import { upload } from "../middleware/multer.js";

const productRouter= Router();
// productRouter.route("/getProduct").get(getAllProducts);
productRouter.route("/newcollections").get(newcollection);
productRouter.route("/getProduct").get(getAllProducts);
productRouter.route("/popularInWomen").get(popularInWomen);
productRouter.route("/addToCart").post(Authjs,addToCart);
// productRouter.route("/getCart").get(Authjs,addToCart);
productRouter.route("/getCart").post(Authjs,getCart);
productRouter.route("/removeCart").post(Authjs,removeCart);
productRouter.route("/removeproduct").post(removeproduct);
// productRouter.route("/addProduct").post(addProduct);
productRouter.route("/addProduct").post(upload.single("product"),addProduct);
// productRouter.route("/upload").post(upload.single("product"),uploadProduct);

export default productRouter;