import * as Yup from "yup";
import Order from "../schemas/Order";
import Product from "../models/Product";
import Category from "../models/Category";
import User from "../models/User";

class OrderController {
	async store(req, res) {
		const schema = Yup.object({
			products: Yup.array()
				.required()
				.of(
					Yup.object({
						id: Yup.number().required(),
						quantity: Yup.number().required(),
					}),
				),
		});

		try {
			schema.validateSync(req.body, { abortEarly: false });
		} catch (err) {
			return res.status(400).json({ error: err.errors });
		}
		const { products } = req.body;

		const productsIds = products.map((p) => p.id);

		const findProducts = await Product.findAll({
			where: {
				id: productsIds,
			},
			include: [
				{
					model: Category,
					as: "category",
					attributes: ["name"],
				},
			],
		});

		const formattedProducts = findProducts.map((p) => {
			const productIndex = products.findIndex((item) => item.id === p.id);

			const newProduct = {
				id: p.id,
				name: p.name,
				category: p.category.name,
				price: p.price,
				url: p.url,
				quantity: products[productIndex].quantity,
			};

			return newProduct;
		});

		const order = {
			user: {
				id: req.userId,
				name: req.userName,
			},
			products: formattedProducts,
			status: "pedido realizado",
		};

		const createdOrder = await Order.create(order);

		return res.status(201).json(createdOrder);
	}

	async index(req, res) {
		const orders = await Order.find();
		return res.json(orders);
	}

	async update(req, res) {
		const schema = Yup.object({
			status: Yup.string().required(),
		});

		try {
			schema.validateSync(req.body, { abortEarly: false });
		} catch (err) {
			return res.status(400).json({ error: err.errors });
		}
		const { admin: isAdmin } = (await User.findByPk(req.userId)) || {};

		if (!isAdmin) {
			return res
				.status(403)
				.json({ error: "Access denied: only admins can create categories" });
		}

		const { id } = req.params;
		const { status } = req.body;

		try {
			const orderExists = await Order.findById(id);
			if (!orderExists) {
				return res.status(404).json({ error: "Order not found" });
			}

			await Order.updateOne({ _id: id }, { status });

			return res.json({ message: "Status updated successfully" });
		} catch (err) {
			return res.status(500).json({ error: "Error updating order id" });
		}
	}
}

export default new OrderController();
