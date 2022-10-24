import Joi from "joi";

export const sendUpdate = Joi.object({
								
	latitude: Joi.number().min(-90).max(90),
	longitude:Joi.number().min(-180).max(180),
	userId: Joi.string()
				
});