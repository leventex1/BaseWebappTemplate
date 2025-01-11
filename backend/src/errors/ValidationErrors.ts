import { ErrorType } from "@common/types/ErrorTypes";
import { BaseError } from "./BaseError";


export class ValidationError extends BaseError {
    constructor(message: string) {
        super(400, message, ErrorType.ValidationError)
    }
}