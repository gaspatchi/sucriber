import Sequelize from "../lib/postgres";
import sequelize from "sequelize";

export const Teachers = Sequelize.define("teachers", {
	teacher_id:{
		type: sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true	
	},
	image_id:{
		type: sequelize.INTEGER,
		allowNull: true	
	},
	firstname:{
		type: sequelize.STRING,
		allowNull: false
	},
	lastname:{
		type: sequelize.STRING,
		allowNull: false
	},
	patronymic:{
		type: sequelize.STRING,
		allowNull: false
	},
	shortname:{
		type: sequelize.STRING,
		allowNull: false
	},
	email:{
		type: sequelize.STRING,
		allowNull: false,
		validate:{
			isEmail: true
		}
	},
	post:{		
		type: sequelize.STRING,
		allowNull: false
	}
});

export const Groups = Sequelize.define("groups", {
	group_id:{
		type: sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	specialty_id: {
		type: sequelize.INTEGER,
		allowNull: false
	},
	teacher_id: {
		type: sequelize.INTEGER,
		allowNull: false,
		references: {
			model: Teachers,
			key: "teacher_id",
			deferrable: sequelize.Deferrable.INITIALLY_IMMEDIATE
		}
	},
	group:{
		type: sequelize.STRING,
		allowNull: false
	},
	course:{
		type: sequelize.INTEGER,
		allowNull: false
	}
});

Teachers.sync({force:false});
Groups.sync({force:false});
Groups.belongsTo(Teachers,{foreignKey:"teacher_id"});