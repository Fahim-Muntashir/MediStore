import { prisma } from "../../lib/prisma";

const getProfile = async (userId: string) => {
  return prisma.user.findUnique({ where: { id: userId } });
};

const updateProfile = async (userId: string, data: any) => {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
};

export const profileService = {
  getProfile,
  updateProfile,
};
