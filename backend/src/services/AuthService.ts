import Auth from "src/models/AuthModel";
import EncryptService from "./EncryptService";
import { AuthInvalidError } from "src/errors/AuthErrors";
import { v4 as uuidv4 } from 'uuid';
import RefreshToken from "src/models/RefreshTokenModel";
import env from "src/envobj";
import { ServerError } from "src/errors/ServerErrors";
import { ResourceNotFoundError } from "src/errors/CommonErrors";
import { Role } from "@common/types/Roles";
import { AccessTokenType } from "src/types/AccessToken";


export default class AuthService {
    private encryptServcie: EncryptService

    constructor(encryptService: EncryptService) {
        this.encryptServcie = encryptService
    }

    public async isAuthExists(handle: string): Promise<boolean> {
        const auth = await Auth.query().findOne({ handle })
        return !!auth
    }

    public async createAuth(handle: string, password: string, userId: number): Promise<void> {
        const hashedPassword = await this.encryptServcie.oneWayHash(password)
        await Auth.query().insert({
            handle, 
            password_hash: hashedPassword,
            user_id: userId
        })
    }

    public async getAuth(handle: string, password: string): Promise<number> {
        const auth = await Auth.query().findOne({ handle })
        if(!auth)
            throw new AuthInvalidError()

        if(!(await this.encryptServcie.compareOneWayHash(password, auth.password_hash)))
            throw new AuthInvalidError()

        return auth.user_id
    }

    public async createRefreshToken(userId: number): Promise<string> {
        let refreshToken = await RefreshToken.query().findOne({ user_id: userId })
        const token = uuidv4()
        let expiration = new Date()
        expiration.setDate(expiration.getDate() + Number(env.REFRESH_TOKEN_EXPIRATION_DAYS))

        if(!refreshToken)
            await RefreshToken.query().insert({ token, expiration, user_id: userId })
        else
            await RefreshToken.query().findById(refreshToken.id).patch({ token, expiration })

        return token
    }

    public async getRefreshToken(token: string): Promise<RefreshToken> {
        const refreshToken = await RefreshToken.query().findOne({ token })
        if(!refreshToken)
            throw new ResourceNotFoundError("RefreshToken")
        return refreshToken
    }

    public isRefreshTokenValid(refreshToken: RefreshToken): boolean {
        return (new Date() <= refreshToken.expiration)
    }

    public createAccessToken(token: AccessTokenType): string {
        return this.encryptServcie.createJWT(token)
    }

    public getAccessToken(token: string): AccessTokenType {
        const decripted: AccessTokenType = this.encryptServcie.verifyJWT(token)
        if(!decripted.userId || !decripted.role)
            throw new ServerError(`User id not in access token`)

        return decripted
    }
}