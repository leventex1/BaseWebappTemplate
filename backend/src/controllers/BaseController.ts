import { Router } from "express"


export default class Controller {
    router: Router

    constructor() {
        this.router = Router()
    }
}