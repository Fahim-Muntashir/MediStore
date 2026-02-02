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
  const cart = await prisma.cart.findMany({
    where: { userId },
    include: { items: true },
  });

  const address = null;

  return { cart, address };
};

const placeOrder = async (
  userId: string,
  data: {
    address: {
      name: string;
      phone: string;
      street: string;
      city: string;
      postalCode: string;
    };
    paymentMethod: "cod" | "online";
  },
) => {
  // Get the user's cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { medicine: true } } },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // Calculate total price
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.medicine.price,
    0,
  );

  // Create the order
  const order = await prisma.order.create({
    data: {
      user: { connect: { id: userId } },
      paymentMethod: data.paymentMethod,
      totalPrice,
      address: data.address,
      items: {
        create: cart.items.map((item) => ({
          medicineId: item.medicineId,
          quantity: item.quantity,
          price: item.medicine.price,
        })),
      },
    },
    include: { items: true },
  });

  // Clear the cart
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  return order;
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
  let cart = await prisma.cart.findFirst({ where: { userId } });

  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, medicineId: productId },
  });

  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  }

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
