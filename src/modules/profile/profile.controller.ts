import { Request, Response, NextFunction } from "express";
import { profileService } from "./profile.service";

const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id!;
    const profile = await profileService.getProfile(userId);
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id!;
    const updatedProfile = await profileService.updateProfile(userId, req.body);
    res.status(200).json(updatedProfile);
  } catch (err) {
    next(err);
  }
};

export const ProfileController = {
  getProfile,
  updateProfile,
};
