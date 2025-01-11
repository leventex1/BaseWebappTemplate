import Joi from "joi"
import { ValidationError } from "src/errors/ValidationErrors"

export function validateOrThrow<T>(data: any, schema: Joi.ObjectSchema<T>): T {
    const { error, value } = schema.validate(data)

    if (error !== undefined) {
        throw new ValidationError(error.message)
    }

    return value
}