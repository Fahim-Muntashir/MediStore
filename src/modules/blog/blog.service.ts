import { prisma } from "../../lib/prisma";

const getAllBlogs = async () => {
  const result = await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return result;
};

const getBlogById = async (id: string) => {
  const result = await prisma.blog.findUnique({
    where: { id }
  });
  return result;
};

export const blogService = {
  getAllBlogs,
  getBlogById
};
