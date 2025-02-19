"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const order_route_1 = require("./app/modules/order/order.route");
const product_route_1 = require("./app/modules/product/product.route");
const user_route_1 = __importDefault(require("./app/modules/user/user.route"));
const auth_route_1 = __importDefault(require("./app/modules/Auth/auth.route"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
//parsers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: [
        "https://bicycle-store-fontend.vercel.app",
        "http://localhost:5173", // Add another origin here
    ],
    credentials: true,
}));
// for access token & cookie
//aplication router
app.use('/api/products', product_route_1.ProductRoutes);
app.use('/api/orders', order_route_1.OrderRoutes);
app.use('/api/users', user_route_1.default);
app.use('/api/auth', auth_route_1.default);
const getAController = (req, res) => {
    res.send();
};
app.get('/', getAController);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
exports.default = app;
