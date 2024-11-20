import Sequelize, { Model } from "sequelize";

class Category extends Model {
	static init(sequelize) {
		// biome-ignore lint/complexity/noThisInStatic: <explanation>
		super.init(
			{
				name: Sequelize.STRING,
			},
			{
				sequelize,
			},
		);
	}
}

export default Category;
