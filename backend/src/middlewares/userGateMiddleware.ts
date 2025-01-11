import { Role } from "@common/types/Roles";
import { NextFunction, Response } from "express";
import { AccessDeniedError } from "src/errors/CommonErrors";
import { BaseRequest } from "src/types/Requests";


export const userGateMiddleware = (role: Role | Role[]) => (req: BaseRequest, _: Response, next: NextFunction) => {
    if(!req.access)
        throw new AccessDeniedError()

    const { role: userRole } = req.access

    if(Array.isArray(role)) {
        if(!role.includes(userRole))
            throw new AccessDeniedError()
    } else {
        if(userRole < role)
            throw new AccessDeniedError()
    }

    next()
}