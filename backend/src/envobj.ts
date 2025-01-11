import dotenv from "dotenv"
import { ServerError } from "./errors/ServerErrors"

dotenv.config()


type u = undefined
interface envType {
    PORT: number | u 
    SECRET: string | u
    ACCESS_TOKEN_EXPIRATION: string | u
    REFRESH_TOKEN_EXPIRATION_DAYS: number | u
}

const convertToNum = (data: any): number | undefined => data ? Number(data) : undefined

const env: envType = {
    PORT: convertToNum(process.env.PORT),
    SECRET: process.env.SECRET,
    ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION,
    REFRESH_TOKEN_EXPIRATION_DAYS: process.env.REFRESH_TOKEN_EXPIRATION_DAYS 
        ? Number(process.env.REFRESH_TOKEN_EXPIRATION_DAYS)
        : undefined
}

Object.entries(env).forEach(([key, value]) => {
    if (value === undefined) {
        throw new ServerError(`Missing environment variable: ${key}`)
    }
})


export default env