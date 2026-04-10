import { prisma } from "../../lib/prisma";
import { OrderStatus } from "../../../generated/prisma/enums";

const getDashboard = async () => {
  const totalUsers = await prisma.user.count();

  const orders = await prisma.order.findMany({
    include: { 
      items: true,
      user: true 
    },
    orderBy: { createdAt: "desc" },
  });

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

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

const createCategory = async (name: string, image?: string) => {
  if (!name || !name.trim()) throw new Error("Invalid category name");

  const baseSlug = name.trim().toLowerCase().replace(/\s+/g, "-");

  let slug = baseSlug;
  let counter = 1;

  while (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  return prisma.category.create({
    data: {
      name: name.trim(),
      slug,
      image: image || null,
    },
  });
};

const updateCategory = async (id: string, name: string, image?: string) => {
  return prisma.category.update({
    where: { id },
    data: {
      name,
      ...(image !== undefined && { image }),
    },
  });
};

const deleteCategory = async (id: string) => {
  return prisma.category.delete({ where: { id } });
};

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
