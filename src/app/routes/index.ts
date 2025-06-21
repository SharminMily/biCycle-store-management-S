import express from "express"
import { ProductRoutes } from "../modules/product/product.route";
import { OrderRoutes } from "../modules/order/order.route";
import userRouter from "../modules/user/user.route";
import authRouter from "../modules/Auth/auth.route";

const router = express.Router();

const moduleRouters = [
    {
        path: '/products',
        route: ProductRoutes
    },
    {
        path: '/orders',
        route: OrderRoutes
    },
    {
        path: '/users',
        route: userRouter
    },
    {
        path: '/auth',
        route: authRouter
    },
]

moduleRouters.forEach(route => router.use(route.path, route.route))

export default router;

