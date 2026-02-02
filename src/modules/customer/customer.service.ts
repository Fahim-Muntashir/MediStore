import { prisma } from "../../lib/prisma";
const getCart = async (userId: string) => {
  return prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          medicine: {
            include: {
              categories: true,
              reviews: true,
              seller: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
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

const addToCart = async (
  userId: string,
  productId: string,
  quantity: number = 1,
) => {
  // Check if the user already has a cart
  let cart = await prisma.cart.findFirst({ where: { userId } });

  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  // Check if the product is already in cart
  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, medicineId: productId },
  });

  if (existingItem) {
    // Update quantity
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  }

  // Add new item
  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      medicineId: productId,
      quantity,
    },
  });
};

export const customerService = {
  getCart,
  getCheckout,
  placeOrder,
  getOrders,
  getOrderById,
  getProfile,
  updateProfile,
  addToCart,
};
