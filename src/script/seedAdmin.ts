import { email } from "better-auth/*";
import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmin() {
  try {
    console.log("admin seeding----------");
    const adminData = {
      name: "Admin",
      email: "admin@admin.com",
      role: UserRole.ADMIN,
      password: "admin@admin.com",
    };

    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUser) {
      throw new Error("Admin user already exists.");
    }

    const signUpAdmin = await fetch(
      // "https://medistore-eight.vercel.app/api/auth/sign-up/email",
      "http://localhost:5000/api/auth/sign-up/email", //add here the online link
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      },
    );

    if (signUpAdmin.ok) {
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
}

seedAdmin();
