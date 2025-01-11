import { AccessTokenName, RefreshTokenName } from "@common/types/Cookies";
import { Response } from "express";


export const setAuthCookies = (res: Response, refreshToken: string, accessToken: string) => {
    res.cookie(RefreshTokenName, refreshToken, { httpOnly: true })
    res.cookie(AccessTokenName, accessToken, { httpOnly: true })
}


export const clearAuthCookies = (res: Response) => {
    res.clearCookie(RefreshTokenName)
    res.clearCookie(AccessTokenName)
}