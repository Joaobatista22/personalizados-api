import { v4 as uuidv4 } from "uuid";
import User from "../models/User";
import * as Yup from "yup";
import { Sequelize } from "sequelize";

class UserController {
	async store(request, response) {
		const userSchema = Yup.object().shape({
			name: Yup.string().required("Name is required"),
			email: Yup.string()
				.email("Invalid email format")
				.required("Email is required"),
			password: Yup.string()
				.min(6, "Password must be at least 6 characters long")
				.required("Password is required"),
			admin: Yup.boolean(),
		});

		try {
			await userSchema.validate(request.body, { abortEarly: false });

			const { name, email, password, admin } = request.body;

			const userExists = await User.findOne({
				where: {
					email,
				},
			});
			if (userExists) {
				return response.status(400).json({ error: "User already exists" });
			}

			const user = await User.create({
				id: uuidv4(),
				name,
				email,
				password,
				admin,
			});

			return response.status(201).json({
				id: user.id,
				name,
				email,
				admin,
			});
		} catch (err) {
			if (err instanceof Sequelize.UniqueConstraintError) {
				return response
					.status(400)
					.json({ error: "Duplicate entry", details: err.errors });
			}
			if (err.name === "ValidationError") {
				return response
					.status(400)
					.json({ error: "Validation failed", details: err.errors });
			}
			return response
				.status(500)
				.json({ error: "Failed to create user", details: err.message });
		}
	}
}

export default new UserController();
