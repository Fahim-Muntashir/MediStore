// src/modules/admin/admin.service.ts
import { prisma } from "../../lib/prisma";

export const adminService = {
  getDashboard: async () => {
    const totalUsers = await prisma.user.count();
    const totalOrders = await prisma.order.count();
    const totalRevenue = await prisma.order.aggregate({
      _sum: { items: { _sum: { price: true } } } as any, // optional: adjust if needed
    });

    return {
      totalUsers,
      totalOrders,
      totalRevenue: (totalRevenue._sum as any) || 0,
    };
  },

  getUsers: async () => {
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
  },

  updateUser: async (userId: string, data: any) => {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  },

  deleteUser: async (userId: string) => {
    return prisma.user.delete({ where: { id: userId } });
  },

  getOrders: async () => {
    return prisma.order.findMany({
      include: {
        user: true,
        items: { include: { medicine: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    return prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  },

  getCategories: async () => {
    return prisma.category.findMany({
      include: { medicines: true },
    });
  },

  createCategory: async (name: string) => {
    return prisma.category.create({ data: { name } });
  },

  updateCategory: async (id: string, name: string) => {
    return prisma.category.update({
      where: { id },
      data: { name },
    });
  },

  deleteCategory: async (id: string) => {
    return prisma.category.delete({ where: { id } });
  },
};
