import Sequelize, { Model } from "sequelize";

class Product extends Model {
	static init(sequelize) {
		// biome-ignore lint/complexity/noThisInStatic: <explanation>
		super.init(
			{
				name: Sequelize.STRING,
				price: Sequelize.INTEGER,
				path: Sequelize.STRING,
				offer: Sequelize.BOOLEAN,
				url: {
					type: Sequelize.VIRTUAL,
					get() {
						return `http://localhost:3001/product-file/${this.path}`;
					},
				},
			},
			{
				sequelize,
			},
		);
		return Product;
	}
	static associate(models) {
		Product.belongsTo(models.Category, {
			foreignKey: "category_id",
			as: "category",
		});
	}
}

export default Product;
