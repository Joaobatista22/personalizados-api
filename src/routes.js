import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";
import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import ProductController from "./app/controllers/ProductController";

const router = new Router();

const upload = multer(multerConfig);

router.post("/users", UserController.store);
router.post("/session", SessionController.store);
router.post("/products", upload.single("file"), ProductController.store);

export default router;
