import { Medicine } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createMedicine = async (
  data: Omit<Medicine, "id" | "sellerId">,
  sellerId: string,
) => {
  const result = await prisma.medicine.create({
    data: {
      ...data,
      seller: {
        connect: { id: sellerId },
      },
    },
  });

  return result;
};

export const medicineService = {
  createMedicine,
};
