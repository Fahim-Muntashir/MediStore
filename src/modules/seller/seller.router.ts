import { Router } from "express";
import { auth, UserRole } from "../../middlewares/auth";
import { SellerController } from "./seller.controller";

const router = Router();

router.use(auth(UserRole.SELLER));

router.get("/dashboard", SellerController.getDashboard);

router.get("/medicines", SellerController.getMedicines);
router.post("/medicines", SellerController.createMedicine);
router.put("/medicines/:id", SellerController.updateMedicine);
router.delete("/medicines/:id", SellerController.deleteMedicine);

router.get("/orders", SellerController.getOrders);
router.put("/orders/:id", SellerController.updateOrderStatus);

export const sellerRouter = router;
