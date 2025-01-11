import AuthService from "./AuthService";
import { CreateUserProps } from "@common/schemaprops/UserProps"
import User from "src/models/UserModel";
import { AuthHandleAlreadyExistsError } from "src/errors/AuthErrors";
import { ResourceNotFoundError } from "src/errors/CommonErrors";
import { Role } from "@common/types/Roles"


export default class UserService {
    private authService: AuthService

    constructor(authService: AuthService) {
        this.authService = authService
    }

    public async createUser(handle: string, password: string, firstName: string, lastName: string, role: Role): Promise<void> {
        const isAuthExists = await this.authService.isAuthExists(handle)

        if(isAuthExists)
            throw new AuthHandleAlreadyExistsError(handle)

        const user = await User.query().insertAndFetch({
            first_name: firstName,
            last_name: lastName,
            role
        })

        await this.authService.createAuth(handle, password, user.id)
    }

    public async getUserById(id: number): Promise<User | undefined> {
        const user = await User.query().findById(id)
        if(!user)
            throw new ResourceNotFoundError("User")
        return user
    }

    public async getUsers(): Promise<User[]> {
        return await User.query().select()
    }

}