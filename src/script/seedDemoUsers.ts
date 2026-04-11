import { prisma } from "../lib/prisma";

const demoUsers = [
  {
    name: "Demo Admin",
    email: "admin@demo.com",
    role: "ADMIN",
    password: "password123",
  },
  {
    name: "Demo Customer",
    email: "customer@demo.com",
    role: "CUSTOMER",
    password: "password123",
  },
  {
    name: "Demo Seller",
    email: "seller@demo.com",
    role: "SELLER",
    password: "password123",
  },
];

async function seedDemoUsers() {
  console.log("Starting demo users seeding...");
  
  for (const userData of demoUsers) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        console.log(`User ${userData.email} already exists, skipping...`);
        continue;
      }

      console.log(`Creating ${userData.role}: ${userData.email}...`);
      
      const response = await fetch(
        "http://localhost:5000/api/auth/sign-up/email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Origin": "http://localhost:5000",
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        console.log(`Successfully created ${userData.email}. Verifying email and setting role...`);
        // The sign-up might not set the role correctly if it's a custom field, 
        // better-auth might just create a default user. 
        // Let's force update the role and emailVerified status.
        await prisma.user.update({
          where: { email: userData.email },
          data: {
            emailVerified: true,
            role: userData.role as any,
          },
        });
        console.log(`User ${userData.email} updated with role ${userData.role}`);
      } else {
        const errorData = await response.json();
        console.error(`Failed to create ${userData.email}:`, errorData);
      }
    } catch (error) {
      console.error(`Error seeding user ${userData.email}:`, error);
    }
  }
  
  console.log("Demo users seeding completed.");
  process.exit(0);
}

seedDemoUsers();
