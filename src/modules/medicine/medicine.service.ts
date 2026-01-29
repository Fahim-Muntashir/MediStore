import { Medicine, Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export interface MedicineFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  manufacturer?: string;
}

type createMedicinePayload = {
  name: string;
  price: number;
  stock: number;
  image: string;
  manufacturer: string;
  description: string;
  categories: string[];
};

const getAllMedicine = async (filter?: MedicineFilter) => {
  const where: any = {};

  if (filter) {
    if (filter.category) {
      where.categories = { some: { name: filter.category } };
    }
    if (filter.manufacturer) {
      where.manufacturer = {
        contains: filter.manufacturer,
        mode: "insensitive",
      };
    }
    if (filter.minPrice || filter.maxPrice) {
      where.price = {};
      if (filter.minPrice) where.price.gte = filter.minPrice;
      if (filter.maxPrice) where.price.lte = filter.maxPrice;
    }
  }

  const result = await prisma.medicine.findMany({
    where,
    include: {
      categories: { select: { name: true } },
      seller: { select: { id: true, name: true } },
    },
  });
  return result;
};

const createMedicine = async (
  data: createMedicinePayload,
  sellerId: string,
) => {
  const categoryRecords = await Promise.all(
    data.categories.map(async (name) => {
      return prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      });
    }),
  );

  console.log(data);
  const result = await prisma.medicine.create({
    data: {
      name: data.name,
      price: data.price,
      stock: data.stock,
      image: data.image,
      description: data.description,
      manufacturer: data.manufacturer,
      sellerId,
      categories: {
        connect: categoryRecords.map((c) => ({ id: c.id })),
      },
    },
    include: {
      categories: true,
    },
  });

  return result;
};

export const medicineService = {
  createMedicine,
  getAllMedicine,
};
