import { NextFunction, Request, Response } from "express";
import { MedicineFilter, medicineService } from "./medicine.service";

const getAllMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { search, category, manufacturer, minPrice, maxPrice } = req.query;

    const filter: Partial<MedicineFilter> = {};

    if (search) filter.search = search as string;
    if (category) filter.category = category as string;
    if (manufacturer) filter.manufacturer = manufacturer as string;
    if (minPrice !== undefined) filter.minPrice = Number(minPrice);
    if (maxPrice !== undefined) filter.maxPrice = Number(maxPrice);

    const result = await medicineService.getAllMedicine(filter);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
const createMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    console.log(req.body);
    const result = await medicineService.createMedicine(
      req.body,
      user.id as string,
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getMedicineById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const idParam = req.params.id;
    if (!idParam || Array.isArray(idParam)) {
      return res.status(400).json({ error: "Invalid Medicine id" });
    }
    const medicine = await medicineService.getMedicineById(idParam);

    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }
    res.status(200).json(medicine);
  } catch (error) {
    next(error);
  }
};
const getFeaturedMedicines = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await medicineService.getFeaturedMedicines();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateMedicineFeatured = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid Medicine ID" });
    }

    // Ensure isFeatured is a boolean
    const updatedStatus = typeof isFeatured === "boolean" ? isFeatured : isFeatured === "true";

    const result = await medicineService.updateMedicineFeatured(id, updatedStatus);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getPopularMedicines = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await medicineService.getPopularMedicines();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const MedicineController = {
  getAllMedicine,
  createMedicine,
  getMedicineById,
  getFeaturedMedicines,
  updateMedicineFeatured,
  getPopularMedicines,
};
