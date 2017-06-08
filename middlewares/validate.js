import Ajv from "ajv";
import Localize from "ajv-i18n";

let ajv = new Ajv({ allErrors: true });

const dispatch_update = {
	"$async": true,
	"required": ["email", "sms"],
	"properties": {
		"email": {"type": "boolean"},
		"sms":{"type": "boolean"}
	}
};

ajv.addSchema(dispatch_update, "dispatch_update");

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