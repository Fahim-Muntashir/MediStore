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
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          medicine: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const itemsBySeller = cart.items.reduce(
    (acc, item) => {
      const sellerId = item.medicine.sellerId;

      if (!acc[sellerId]) {
        acc[sellerId] = [];
      }

      acc[sellerId].push(item);

      return acc;
    },
    {} as Record<string, typeof cart.items>,
  );

  const orders = [];

  for (const sellerId of Object.keys(itemsBySeller)) {
    const sellerItems = itemsBySeller[sellerId];

    if (!sellerItems || sellerItems.length === 0) continue;

    const totalPrice = sellerItems.reduce(
      (sum, item) => sum + item.quantity * item.medicine.price,
      0,
    );

    const order = await prisma.order.create({
      data: {
        userId,
        sellerId,
        paymentMethod: data.paymentMethod,
        totalPrice,
        address: data.address,
        items: {
          create: sellerItems.map((item) => ({
            medicineId: item.medicineId,
            quantity: item.quantity,
            price: item.medicine.price,
          })),
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
    });

    orders.push(order);
  }

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  return orders;
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

  addToCart,
};
