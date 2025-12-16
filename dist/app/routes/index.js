"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_route_1 = require("../modules/product/product.route");
const order_route_1 = require("../modules/order/order.route");
const user_route_1 = __importDefault(require("../modules/user/user.route"));
const auth_route_1 = __importDefault(require("../modules/Auth/auth.route"));
const router = express_1.default.Router();
const moduleRouters = [
    {
        path: '/products',
        route: product_route_1.ProductRoutes
    },
    {
        path: '/orders',
        route: order_route_1.OrderRoutes
    },
    {
        path: '/users',
        route: user_route_1.default
    },
    {
        path: '/auth',
        route: auth_route_1.default
    },
];
moduleRouters.forEach(route => router.use(route.path, route.route));
exports.default = router;
