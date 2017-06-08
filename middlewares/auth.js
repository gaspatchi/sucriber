import axios from "axios";
import config from "../config";
import {auth_count} from "../lib/prometheus";

const regex = /Bearer\s(\S+)/;

export default async (req, res, next)=>{
	try{
		let token = regex.exec(req.get("Authorization"))[1];
		let result = await axios.post(`http://${config.tokenzer.address}:${config.tokenzer.port}/verify`,{token: token},{
			timeout: 1000,
			validateStatus(status){return status >= 200 && status <500; 
			}
		});
		if (result.status == 200){
			auth_count.inc();
			req.app.locals.profile = result.data;
			next();
		} else {
			res.status(403).send(result.data);
		}
	} catch(error){
		console.log({ type: "Error", module: "verifyAuth", message: error.message, date: new Date().toJSON() });
		res.status(500).json({message : "Невозможно проверить сессию"});
	}
};