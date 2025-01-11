import { ErrorType } from "@common/types/ErrorTypes"


export class BaseError extends Error {
    public readonly statusCode: number
    public readonly errorType: ErrorType

    constructor(statusCode: number, message: string, errorType: ErrorType) {
        super(message)
        this.statusCode = statusCode
        this.errorType = errorType
    }
}