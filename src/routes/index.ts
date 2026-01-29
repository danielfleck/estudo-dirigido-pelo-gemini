import { Router, Request, Response } from "express"
import UserController from "../controllers/UserController"

const routes = Router()

routes.get("/", (req: Request, res: Response) => {

    return res.json({
        message: "Hello World!",
        timestamp: new Date(),
    })

})

routes.get("/users", UserController.index)

routes.post("/users", UserController.store)

export default routes
