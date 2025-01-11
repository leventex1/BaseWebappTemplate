import { ErrorType } from "@common/types/ErrorTypes";
import { BaseError } from "./BaseError";


export class ResourceNotFoundError extends BaseError {
    constructor(resource: string) {
        super(404, `Resource(${resource}) not found!`, ErrorType.ResourceNotFoundError)
    }
}


export class AccessDeniedError extends BaseError {
    constructor() {
        super(403, "Access denied!", ErrorType.AccessDeniedError)
    }
}