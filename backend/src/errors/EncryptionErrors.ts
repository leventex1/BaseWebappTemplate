import { ErrorType } from "@common/types/ErrorTypes";
import { BaseError } from "./BaseError";


export class AccessTokenError extends BaseError {
    constructor(errorName: string) {
        super(400, errorName, ErrorType.AccessTokenError)
    }
}


export class AccessTokenExpiredError extends BaseError {
    constructor(errorName: string) {
        super(400, errorName, ErrorType.AccessTokenExpiredError)
    }
}