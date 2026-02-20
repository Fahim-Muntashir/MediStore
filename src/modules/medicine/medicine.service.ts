import { Medicine, Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export interface MedicineFilter {
  search?: string;
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
    // 🔎 Search by name
    if (filter.search) {
      where.name = {
        contains: filter.search,
        mode: "insensitive",
      };
    }

    // 📂 Filter by category
    if (filter.category) {
      where.categories = {
        some: {
          name: filter.category,
        },
      };
    }

    // 🏭 Filter by manufacturer
    if (filter.manufacturer) {
      where.manufacturer = {
        contains: filter.manufacturer,
        mode: "insensitive",
      };
    }

    // 💰 Filter by price range
    if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
      where.price = {};
      if (filter.minPrice !== undefined) where.price.gte = filter.minPrice;
      if (filter.maxPrice !== undefined) where.price.lte = filter.maxPrice;
    }
  }

  return prisma.medicine.findMany({
    where,
    include: {
      categories: {
        select: { id: true, name: true },
      },
      seller: {
        select: { id: true, name: true },
      },
    },
  });
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

const getMedicineById = async (id: string) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id },
    include: {
      categories: { select: { name: true } },
      seller: { select: { id: true, name: true } },
    },
  });
  return medicine;
};
export const medicineService = {
  createMedicine,
  getAllMedicine,
  getMedicineById,
};
