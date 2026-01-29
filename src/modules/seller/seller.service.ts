import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getDashboard = async (sellerId: string) => {
  const orders = await prisma.order.findMany({
    where: { items: { some: { medicine: { sellerId } } } },
    include: { items: true },
  });

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, order) =>
      sum + order.items.reduce((s, item) => s + item.price * item.quantity, 0),
    0,
  );

  return { totalOrders, totalRevenue, orders };
};

const getMedicines = async (sellerId: string) => {
  return prisma.medicine.findMany({
    where: { sellerId },
    include: { categories: true },
  });
};

const createMedicine = async (data: any, sellerId: string) => {
  return prisma.medicine.create({
    data: {
      ...data,
      sellerId,
    },
  });
};

const updateMedicine = async (id: string, data: any, sellerId: string) => {
  return prisma.medicine.updateMany({
    where: { id, sellerId },
    data,
  });
};

const deleteMedicine = async (id: string, sellerId: string) => {
  return prisma.medicine.deleteMany({ where: { id, sellerId } });
};

const getOrders = async (sellerId: string) => {
  const medicines = await prisma.medicine.findMany({
    where: { sellerId },
    select: { id: true },
  });

  const medicineIds = medicines.map((m) => m.id);

  if (medicineIds.length === 0) {
    return [];
  }

  return prisma.order.findMany({
    where: {
      items: {
        some: {
          medicineId: { in: medicineIds },
        },
      },
    },
    include: {
      items: {
        include: {
          medicine: true,
        },
      },
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateOrderStatus = async (
  orderId: string,
  sellerId: string,
  status: OrderStatus,
) => {
  const medicineIds = await prisma.medicine
    .findMany({
      where: { sellerId },
      select: { id: true },
    })
    .then((meds) => meds.map((m) => m.id));

  return prisma.order.updateMany({
    where: {
      id: orderId,
      items: { some: { medicineId: { in: medicineIds } } },
    },
    data: { status },
  });
};

export const sellerService = {
  getDashboard,
  getMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getOrders,
  updateOrderStatus,
};
