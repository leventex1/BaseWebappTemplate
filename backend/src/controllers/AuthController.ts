import AuthService from "src/services/AuthService";
import Controller from "./BaseController";
import { Request, Response } from "express";
import { validateOrThrow } from "src/utils/ValidateOrThrow";
import { AuthUserSchema } from "src/schemas/UserSchemas";
import { RefreshTokenName, AccessTokenName } from "@common/types/Cookies"
import UserService from "src/services/UserService";
import { setAuthCookies } from "src/utils/AccessCookies";


export default class AuthController extends Controller {
    private authService: AuthService
    private userService: UserService

    constructor(authServcie: AuthService, userService: UserService) {
        super()
        this.authService = authServcie
        this.userService = userService

        this.router.post("/", this.getAuth.bind(this))
    }

    public async getAuth(req: Request, res: Response) {
        const authUserProps = validateOrThrow(req.body, AuthUserSchema)

        const userId = await this.authService.getAuth(authUserProps.handle, authUserProps.password)
        const refreshToken = await this.authService.createRefreshToken(userId)
        const user = await this.userService.getUserById(userId)
        const accessToken = this.authService.createAccessToken({ userId, role: user.role })

        setAuthCookies(res, refreshToken, accessToken)
        res.status(200).json(userId)
    }

}