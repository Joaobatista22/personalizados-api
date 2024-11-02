import { Router } from "express";

import User from "./app/models/User";

const router = new Router();

router.get("/", (req, res) => {
	res.send("Hello from routes!");
});

export default router;
