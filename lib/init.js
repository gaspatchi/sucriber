import config from "../config";
import Consul from "consul";

function setTarantool(consul) {
	consul.catalog.service.nodes("tarantool", (error, result) => {
		if (error) {
			console.log({ type: "Fatal", module: "Init", section: "setTarantool", message: error, date: new Date().toJSON() });
			process.exit();
		}
		config.tarantool.address = result[0].ServiceAddress;
		config.tarantool.port = result[0].ServicePort;
		console.log({ type: "Info", module: "Init", section: "setTarantool", message: "Успешное получение информации о Tarantool", date: new Date().toJSON() });
	});
}

function setTokenzer(consul) {
	consul.catalog.service.nodes("tokenzer", (error, result) => {
		if (error) {
			console.log({ type: "Fatal", module: "Init", section: "setTokenzer", message: error, date: new Date().toJSON() });
			process.exit();
		}
		config.tokenzer.address = result[0].ServiceAddress;
		config.tokenzer.port = result[0].ServicePort;
		console.log({ type: "Info", module: "Init", section: "setTokenzer", message: "Успешное получение информации о Tokenzer", date: new Date().toJSON() });
	});
}

export default () => {
	let consul = Consul();
	setTarantool(consul);
	setTokenzer(consul);
	consul.agent.service.register({ name: config.server.name, address: config.server.address, port: config.server.port }, (error) => {
		if (error) {
			console.log({ type: "Fatal", module: "Init", section: "serviceRegister", message: error, date: new Date().toJSON() });
			process.exit();
		}
		console.log({ type: "Info", module: "Init", section: "serviceRegister", message: "Успешная регистрация сервиса", date: new Date().toJSON() });
	});
};