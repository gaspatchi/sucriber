import TarantoolConnection from "tarantool-driver";
import config from "../config";

class Tarantool {
	async _connect() {
		let connection = new TarantoolConnection(config.tarantool);
		await connection.connect();
		await connection.auth(config.tarantool.user, config.tarantool.password);
		return connection;
	}

	async getDispatch(user_id) {
		let connection = await this._connect();
		let response = await connection.call("getDispatch", user_id);
		return response;
	}

	async updateDispatch(user_id, email, sms) {
		let connection = await this._connect();
		let response = await connection.call("updateDispatch", user_id, email, sms);
		return response;
	}

	async addSubscriptions(user_id, section, destination, type, id) {
		let connection = await this._connect();
		let response = await connection.call("addSubscriptions", user_id, section, destination, type, id);
		return response;
	}

	async deleteSubscriptions(user_id, section, destination, type, id) {
		let connection = await this._connect();
		let response = await connection.call("deleteSubscriptions", user_id, section, destination, type, id);
		return response;
	}

	async selectSubscriptions(user_id) {
		let connection = await this._connect();
		let response = await connection.call("selectSubscriptions", user_id);
		return response;
	}
}

export default new Tarantool;