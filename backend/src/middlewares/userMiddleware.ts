import { ErrorType } from "@common/types/ErrorTypes";
import { NextFunction, Response } from "express";
import AuthService from "src/services/AuthService";
import { BaseRequest } from "src/types/Requests";
import { checkError } from "@common/utils/ErrorCheck"
import { AccessTokenName, RefreshTokenName } from "@common/types/Cookies";
import UserService from "src/services/UserService";
import { clearAuthCookies, setAuthCookies } from "src/utils/AccessCookies";


export const userMiddleware = (authService: AuthService, userService: UserService) => async (req: BaseRequest, res: Response, next: NextFunction) => {
    const cookies = req.cookies
    const refreshTokenStr = cookies.refresh_token
    const accessToken = cookies.access_token

    if(accessToken && refreshTokenStr) {
        try {
            const access = authService.getAccessToken(accessToken);
            req.access = access
        } catch(error) {
            if(checkError(error, ErrorType.AccessTokenExpiredError)) {

                try {
                    const refreshToken = await authService.getRefreshToken(refreshTokenStr)
                    const isValid = authService.isRefreshTokenValid(refreshToken)

                    if(isValid) {
                        const newRefreshTokenStr = await authService.createRefreshToken(refreshToken.user_id)
                        const user = await userService.getUserById(refreshToken.user_id)
                        const newAccessToken = authService.createAccessToken({ userId: refreshToken.user_id, role: user.role })

                        setAuthCookies(res, newRefreshTokenStr, newAccessToken)

                        req.access = {
                            userId: refreshToken.user_id,
                            role: user.role
                        }
                    }

                } catch(error) {
                    if(!checkError(error, ErrorType.ResourceNotFoundError))
                        throw error
                }
            } else {
                clearAuthCookies(res)
                throw error
            }
        }
    }

    next()
}