import { createServer } from "node:http"
import express, { NextFunction, Response } from "express"
import createAPI from "./api"
import env from "./envobj"
import { Database } from "./db"
import { BaseError } from "./errors/BaseError"
import "express-async-errors"
import cookieParser from "cookie-parser"
import { BaseRequest } from "./types/Requests"


(async () => {

    await Database.init()

    const app = express()

    app.use(express.json())
    app.use(cookieParser())


    app.use((req: BaseRequest, _: Response, next: NextFunction) => {
        console.info("[Info]", req.ip, req.path, req.method, req.body)
        next()
    })

    const api = createAPI()
    app.use("/api/", api)

    app.use((err: BaseError, req: BaseRequest, res: Response, _: NextFunction): void => {
        console.error("[Error]", req.path, req.method, err.statusCode, `type: ${err.errorType}, message: ${err.message}, user: ${req.access ? `${req.access.userId}/${req.access.role}` : "none" }`)
        res.status(err.statusCode).json({
            status: "error",
            errorType: err.errorType,
            message: err.message
        })
    })

    const server = createServer(app)
    server.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT}`)
    })

})()