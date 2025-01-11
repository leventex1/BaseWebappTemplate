import { ErrorType } from "@common/types/ErrorTypes";
import { BaseError } from "./BaseError";


export class AuthHandleAlreadyExistsError extends BaseError {
    constructor(handle: string) {
        super(403, `Auth with handle: ${handle} aldready exists!`, ErrorType.AuthHandleAlreadyExistsError)
    }
}


export class AuthInvalidError extends BaseError {
    constructor() {
        super(401, "Invalid authentication", ErrorType.AuthInvalidError)
    }
}