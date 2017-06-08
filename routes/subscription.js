import express from "express";
import { JsonValidate } from "../middlewares/validate";
import verifyAuth from "../middlewares/auth";
import tarantool from "../lib/tarantool";
import { Groups, Teachers } from "../models/subscription";
import { get_dispatch, update_dispatch, update_schedule, delete_schedule, get_schedule } from "../lib/prometheus";

let subscription_router = express.Router();

subscription_router.get("/dispatch", verifyAuth, async (req, res) => {
	try {
		let response = await tarantool.getDispatch(req.app.locals.profile.sub);
		if (response[0][0] === true) {
			get_dispatch.inc();
			res.status(200).json(response[1][0]);
		} else {
			res.status(400).json({ message: response[1][0] });
		}
	} catch (error) {
		console.log({ type: "Error", module: "Subscription", section: "getDispatch", message: error.message, date: new Date().toJSON() });
		res.status(500).json({ message: "Невозможно получить список каналов рассылки" });
	}
});


subscription_router.post("/dispatch", JsonValidate("dispatch_update"), verifyAuth, async (req, res) => {
	try {
		let response = await tarantool.updateDispatch(req.app.locals.profile.sub, req.body.email, req.body.sms);
		if (response[0][0] === true) {
			update_dispatch.inc();
			res.status(200).json({ message: response[1][0] });
		} else {
			res.status(400).json({ message: response[1][0] });
		}
	} catch (error) {
		console.log({ type: "Error", module: "Subscription", section: "updateDispatch", message: error.message, date: new Date().toJSON() });
		res.status(500).json({ message: "Невозможно обновить каналы рассылки" });
	}
});

subscription_router.post("/schedule/:type/:id", verifyAuth, async (req, res) => {
	try {
		if (req.params.type === "group") {
			let exists = await Groups.count({ where: { group_id: req.params.id } });
			if (exists !== 0) {
				let response = await tarantool.addSubscriptions(req.app.locals.profile.sub, req.params.type, req.params.id);
				if (response[0][0] === true) {
					update_schedule.labels("group").inc();
					res.status(200).json({ message: response[1][0] });
				} else {
					res.status(400).json({ message: response[1][0] });
				}
			} else {
				res.status(200).json({ message: "Такой группы не существует" });
			}
		} else if (req.params.type === "teacher") {
			let exists = await Teachers.count({ where: { teacher_id: req.params.id } });
			if (exists !== 0) {
				let response = await tarantool.addSubscriptions(req.app.locals.profile.sub, req.params.type, req.params.id);
				if (response[0][0] === true) {
					update_schedule.labels("teacher").inc();
					res.status(200).json({ message: response[1][0] });
				} else {
					res.status(400).json({ message: response[1][0] });
				}
			} else {
				res.status(200).json({ message: "Такого преподавателя не существует" });
			}
		} else {
			res.status(400).json({ message: `Метод ${req.params.type} недоступен` });
		}
	} catch (error) {
		console.log({ type: "Error", module: "Subscription", section: "updateSubscriptions", message: error.message, date: new Date().toJSON() });
		res.status(500).json({ message: "Невозможно добавить подписку" });
	}
});

subscription_router.delete("/schedule/:type/:id", verifyAuth, async (req, res) => {
	try {
		if (req.params.type === "group") {
			let exists = await Groups.count({ where: { group_id: req.params.id } });
			if (exists !== 0) {
				let response = await tarantool.deleteSubscriptions(req.app.locals.profile.sub, req.params.type, req.params.id);
				if (response[0][0] === true) {
					delete_schedule.labels("group").inc();
					res.status(200).json({ message: response[1][0] });
				} else {
					res.status(400).json({ message: response[1][0] });
				}
			} else {
				res.status(200).json({ message: "Такой группы не существует" });
			}
		} else if (req.params.type === "teacher") {
			let exists = await Teachers.count({ where: { teacher_id: req.params.id } });
			if (exists !== 0) {
				let response = await tarantool.deleteSubscriptions(req.app.locals.profile.sub, req.params.type, req.params.id);
				if (response[0][0] === true) {
					delete_schedule.labels("teacher").inc();
					res.status(200).json({ message: response[1][0] });
				} else {
					res.status(400).json({ message: response[1][0] });
				}
			} else {
				res.status(200).json({ message: "Невозможно удалить подписку" });
			}
		} else {
			res.status(400).json({ message: `Метод ${req.params.type} недоступен` });
		}
	} catch (error) {
		console.log({ type: "Error", module: "Subscription", section: "deleteSubscriptions", message: error.message, date: new Date().toJSON() });
		res.status(500).json({ message: "Невозможно удалить подписку" });
	}
});

subscription_router.get("/schedule", verifyAuth, async (req, res) => {
	try {
		let response = await tarantool.selectSubscriptions(req.app.locals.profile.sub);
		if (response[0][0] === true) {
			let groups = await Groups.findAll({ attributes: ["group_id", "group", "course"], where: { group_id: response[1] } });
			let teachers = await Teachers.findAll({ attributes: ["teacher_id", "firstname", "lastname", "patronymic"], where: { teacher_id: response[2] } });
			get_schedule.inc();
			res.status(200).json({ groups, teachers });
		} else {
			res.status(400).json({ message: response[1][0] });
		}
	} catch (error) {
		console.log({ type: "Error", module: "Subscription", section: "updateSubscriptions", message: error.message, date: new Date().toJSON() });
		res.status(500).json({ message: "Невозможно получить список подписок" });
	}
});


export default subscription_router;