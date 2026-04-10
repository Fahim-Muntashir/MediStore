import express from "express";

import { Router } from "express";
import { auth, UserRole } from "../../middlewares/auth";
import { MedicineController } from "./medicine.controller";
const router = express.Router();

router.get("/", MedicineController.getAllMedicine);
router.get("/featured", MedicineController.getFeaturedMedicines);
router.get("/popular", MedicineController.getPopularMedicines);
router.post("/", auth(UserRole.SELLER), MedicineController.createMedicine);

router.patch(
  "/:id/featured",
  auth(UserRole.SELLER, UserRole.ADMIN),
  MedicineController.updateMedicineFeatured,
);

router.get("/:id", MedicineController.getMedicineById);

export const medicineRouter: Router = router;
