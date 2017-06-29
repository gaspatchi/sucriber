import Ajv from "ajv";
import Localize from "ajv-i18n";

let ajv = new Ajv({ allErrors: true });

const dispatch_update = {
	"$async": true,
	"required": ["email", "sms"],
	"properties": {
		"email": { "type": "boolean" },
		"sms": { "type": "boolean" }
	}
};

const subscription_update = {
	"$async": true,
	"required": ["section", "destination", "type", "id"],
	"properties": {
		"section": { "type": "string" },
		"destination": { "type": "string" },
		"type": { "type": "string" },
		"id": { "type": "integer" }
	}
};

ajv.addSchema(dispatch_update, "dispatch_update");
ajv.addSchema(subscription_update, "subscription_update");

export function JsonValidate(options) {
	return async (req, res, next) => {
		try {
			await ajv.validate(options, req.body);
			next();
		} catch (error) {
			Localize.ru(error.errors);
			res.status(400).json(error.errors);
		}
	};
}

export function errorHandler(error, req, res, next) {
	if (error instanceof SyntaxError) {
		res.status(400).json({ message: "Ошибка при обработке запроса" });
	} else {
		next();
	}
}