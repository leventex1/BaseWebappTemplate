import { ErrorType } from "@common/types/ErrorTypes";
import { BaseError } from "./BaseError";


export class ServerError extends BaseError {
    constructor(message: string) {
        super(500, message, ErrorType.ServerError)
    }
}