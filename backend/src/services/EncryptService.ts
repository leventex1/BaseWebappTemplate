import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { AccessTokenError, AccessTokenExpiredError } from "src/errors/EncryptionErrors"
import { ServerError } from "src/errors/ServerErrors"
import env from "src/envobj"


export default class EncryptService {

    constructor() { }

    public encrypt(data: string): string {
        return `encrypted/${data}/`
    }

    public async oneWayHash(data: string): Promise<string> {
        return await bcrypt.hash(data, 10)
    }

    public async compareOneWayHash(original: string, encrypted: string): Promise<boolean> {
        return await bcrypt.compare(original, encrypted)
    }

    public createJWT(data: any) {
        return jwt.sign({
            data
        }, 
        env.SECRET, {
            expiresIn: env.ACCESS_TOKEN_EXPIRATION
        })
    }

    public verifyJWT(jwtToken: string): any {
        try {
            const decoded = (jwt.verify(jwtToken, env.SECRET) as JwtPayload)

            if(!decoded.data)
                throw new Error("Invalid jwt token data!")

            return decoded.data
        } catch(error) {
            if(error.name) {
                if(error.name === "TokenExpiredError")
                    throw new AccessTokenExpiredError(error.name)
                
                throw new AccessTokenError(error.name)
            } else {
                throw new ServerError(error.message)
            }
        }
    }

}