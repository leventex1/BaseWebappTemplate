import { ErrorType } from "@common/types/ErrorTypes";


export const checkError = (error: any, type: ErrorType) => {
    return error.errorType && error.errorType === type
}