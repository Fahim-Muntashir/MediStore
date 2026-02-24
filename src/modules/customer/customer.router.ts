import { Router } from "express";
import { auth, UserRole } from "../../middlewares/auth";
import { CustomerController } from "./customer.controller";

const router = Router();

router.use(auth(UserRole.CUSTOMER));

router.get("/cart", CustomerController.getCart);
router.post("/cart/add", CustomerController.addToCart);
router.get("/checkout", CustomerController.getCheckout);
router.post("/checkout", CustomerController.placeOrder);

router.get("/orders", CustomerController.getOrders);
router.post("/orders/:orderId/review", CustomerController.leaveReview);
router.get("/orders/:id", CustomerController.getOrderById);

export const customerRouter = router;
