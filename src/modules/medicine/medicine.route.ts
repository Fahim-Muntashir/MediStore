import express from "express";

import { Router } from "express";
import { auth, UserRole } from "../../middlewares/auth";
import { MedicineController } from "./medicine.controller";
const router = express.Router();

router.get("/", MedicineController.getAllMedicine);
router.post("/", auth(UserRole.CUSTOMER), MedicineController.createMedicine);

// get single medicine
router.get("/:id", MedicineController.getMedicineById);
export const medicineRouter: Router = router;
