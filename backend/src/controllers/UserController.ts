import { Response } from "express";
import Controller from "./BaseController";
import UserService from "src/services/UserService";
import { AdminCreateUserSchema, CreateUserSchema } from "src/schemas/UserSchemas";
import { validateOrThrow } from "src/utils/ValidateOrThrow";
import { AuthorizedRequest, BaseRequest } from "src/types/Requests";
import { Role } from "@common/types/Roles";
import { userGateMiddleware } from "src/middlewares/userGateMiddleware";
import { CreateUserProps } from "@common/schemaprops/UserProps";


export default class UserController extends Controller {
    private userService: UserService

    constructor(userService: UserService) {
        super()
        this.userService = userService

        this.router.get("/", userGateMiddleware(Role.Admin), this.getUsers.bind(this))
        this.router.post("/", userGateMiddleware(Role.Manager), this.createUser.bind(this))
    }

    public async getUsers(req: BaseRequest, res: Response) {
        const users = await this.userService.getUsers()

        res.status(200).json(users.map(user => user.toFront()))
    }

    public async createUser(req: AuthorizedRequest, res: Response) {
        const { role } = req.access

        let createUserProps: CreateUserProps
        if(role === Role.Admin)
            createUserProps = validateOrThrow(req.body, AdminCreateUserSchema)
        else 
            createUserProps = validateOrThrow(req.body, CreateUserSchema)

        await this.userService.createUser(
            createUserProps.handle,
            createUserProps.password,
            createUserProps.firstName,
            createUserProps.lastName,
            createUserProps.role
        )

        res.sendStatus(200)
    }

}