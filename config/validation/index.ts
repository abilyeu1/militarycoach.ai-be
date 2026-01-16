import * as Joi from 'joi';

export const validationSchema = Joi.object({
    PORT: Joi.number().default(3100),
    MONGO_CONNECTION: Joi.string().required(),
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    CUSTOM: Joi.string().default('custom'),
    // OPEN_AI_SK: Joi.string().required(),
});
#ewoifj 
