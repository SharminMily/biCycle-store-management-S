"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const router = express_1.default.Router();
router.get('/revenue', (0, auth_1.default)('admin', 'user'), order_controller_1.OrderControllers.calculateAllOrder);
router.get("/verify", (0, auth_1.default)('admin', 'user'), order_controller_1.OrderControllers.verifyPayment);
router.get('/:id', (0, auth_1.default)('admin', 'user'), order_controller_1.OrderControllers.getSingleOrder);
router.get('/', (0, auth_1.default)('admin'), order_controller_1.OrderControllers.getAllOrder);
router.post('/', (0, auth_1.default)('admin', 'user'), order_controller_1.OrderControllers.createOrder);
router.put('/:id', (0, auth_1.default)('admin', 'user'), order_controller_1.OrderControllers.getUpdateOrder);
router.delete('/:id', (0, auth_1.default)('admin', 'user'), order_controller_1.OrderControllers.getDeleteOrder);
exports.OrderRoutes = router;
