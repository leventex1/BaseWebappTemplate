import Joi from "joi"
import { maxFirstName, maxHandleLength, maxLastName, maxPasswordLength } from "@common/constrains/AuthConstrains"
import { AuthUserProps, CreateUserProps } from "@common/schemaprops/UserProps"
import { Role, roles } from "@common/types/Roles"


export const AdminCreateUserSchema = Joi.object<CreateUserProps>({
    handle: Joi.string().max(maxHandleLength).required(),
    password: Joi.string().max(maxPasswordLength).required(),
    firstName: Joi.string().max(maxFirstName).required(),
    lastName: Joi.string().max(maxLastName).required(),
    role: Joi.number().equal(...roles).required()
})


export const CreateUserSchema = Joi.object<CreateUserProps>({
    handle: Joi.string().max(maxHandleLength).required(),
    password: Joi.string().max(maxPasswordLength).required(),
    firstName: Joi.string().max(maxFirstName).required(),
    lastName: Joi.string().max(maxLastName).required(),
    role: Joi.number().equal(Role.Colleague, Role.Manager).required()
})



export const AuthUserSchema = Joi.object<AuthUserProps>({
    handle: Joi.string().max(maxHandleLength).required(),
    password: Joi.string().max(maxPasswordLength).required()
})