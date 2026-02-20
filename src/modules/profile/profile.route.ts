import { Router } from "express";
import { auth, UserRole } from "../../middlewares/auth";
import { ProfileController } from "./profile.controller";

const router = Router();

router.use(auth(UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN));

router.get("/", ProfileController.getProfile);
router.put("/", ProfileController.updateProfile);

export const profileRouter = router;
