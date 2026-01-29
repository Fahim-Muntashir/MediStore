import { prisma } from "../../lib/prisma";

const getCart = async (userId: string) => {
  return prisma.cart.findMany({
    where: { userId },
    include: { items: true },
  });
};

const getCheckout = async (userId: string) => {
  // Fetch cart items
  const cart = await prisma.cart.findMany({
    where: { userId },
    include: { items: true },
  });

  const address = null;

  return { cart, address };
};

const placeOrder = async (userId: string, data: any) => {
  // TODO: implement order placement logic
  return { success: true, userId, data };
};

const getOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
  });
};

const getOrderById = async (userId: string, orderId: string) => {
  return prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true },
  });
};

const getProfile = async (userId: string) => {
  return prisma.user.findUnique({ where: { id: userId } });
};

const updateProfile = async (userId: string, data: any) => {
  return prisma.user.update({ where: { id: userId }, data });
};

export const customerService = {
  getCart,
  getCheckout,
  placeOrder,
  getOrders,
  getOrderById,
  getProfile,
  updateProfile,
};
