import { NextFunction, Request, Response } from "express";
import { medicineService } from "./medicine.service";

const getAllMedicine = async () => {};

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

export const MedicineController = {
  getAllMedicine,
  createMedicine,
};
