import { Router, Request, Response } from "express"
import UserController from "../controllers/UserController"
import AuthController from "../controllers/AuthController"
import { authMiddleware } from "../middlewares/AuthMiddleware"

const routes = Router()

routes.get("/", (req: Request, res: Response) => {

    return res.json({
        message: "Hello World!",
        timestamp: new Date(),
    })

})

// O Login DEVE ser público (senão ninguém entra)
routes.post("/login", AuthController.authenticate)

routes.post('/auth', AuthController.authenticate)

// O Cadastro (Store) geralmente é público para novos usuários entrarem
routes.post("/users", UserController.store)

routes.use(authMiddleware)

routes.get("/users", UserController.index)

routes.put('/users/:id', UserController.update)

routes.delete('/users/:id', UserController.delete)

export default routes
