import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";
import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import ProductController from "./app/controllers/ProductController";
import CategoryController from "./app/controllers/CategoryController copy";
import authMiddleware from "./app/middlewares/auth";
import OrderComtroller from "./app/controllers/OrderComtroller";

const routes = new Router();

const upload = multer(multerConfig);

routes.post("/users", UserController.store);
routes.post("/session", SessionController.store);

routes.use(authMiddleware);
routes.post("/products", upload.single("file"), ProductController.store);
routes.get("/products", ProductController.index);

routes.post("/categories", CategoryController.store);
routes.get("/categories", CategoryController.index);

routes.post("/orders", OrderComtroller.store);
routes.get("/orders", OrderComtroller.index);
routes.put("/orders/:id", OrderComtroller.update);

export default routes;
