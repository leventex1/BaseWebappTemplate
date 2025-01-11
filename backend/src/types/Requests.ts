import { Role } from "@common/types/Roles";
import { Request } from "express";
import { AccessTokenType } from "./AccessToken";


export interface BaseRequest extends Request {
    access: AccessTokenType | undefined
}


export interface AuthorizedRequest extends Request {
    access: AccessTokenType
}