// src/modules/admin/admin.service.ts
import { prisma } from "../../lib/prisma";
import { OrderStatus } from "../../../generated/prisma/enums";

const getDashboard = async () => {
  const totalUsers = await prisma.user.count();

  const orders = await prisma.order.findMany({
    include: { items: true },
  });

  const totalOrders = orders.length;

  // Calculate total revenue from items (price * quantity)
  const totalRevenue = orders.reduce(
    (sum, order) =>
      sum + order.items.reduce((s, item) => s + item.price * item.quantity, 0),
    0,
  );

  return { totalUsers, totalOrders, totalRevenue, orders };
};

const getUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });
};

const updateUser = async (userId: string, data: any) => {
  return prisma.user.update({ where: { id: userId }, data });
};

const deleteUser = async (userId: string) => {
  return prisma.user.delete({ where: { id: userId } });
};

const getOrders = async () => {
  return prisma.order.findMany({
    include: {
      user: true,
      items: { include: { medicine: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
};

const getCategories = async () => {
  return prisma.category.findMany({
    include: { medicines: true },
  });
};

const createCategory = async (name: string) => {
  return prisma.category.create({ data: { name } });
};

const updateCategory = async (id: string, name: string) => {
  return prisma.category.update({ where: { id }, data: { name } });
};

const deleteCategory = async (id: string) => {
  return prisma.category.delete({ where: { id } });
};

// ✅ Export all in the same style as medicineService
export const adminService = {
  getDashboard,
  getUsers,
  updateUser,
  deleteUser,
  getOrders,
  updateOrderStatus,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
