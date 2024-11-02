import express, { json } from "express";
import routes from "./routes";

import "./database";

class App {
	constructor() {
		this.app = express();
		this.middlewares();
		this.routes();
	}

	middlewares() {
		this.app.use(json());
	}

	routes() {
		this.app.use(routes);
	}
}

export default new App().app;
