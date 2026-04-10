import express, { Application } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { medicineRouter } from "./modules/medicine/medicine.route";
import { customerRouter } from "./modules/customer/customer.router";
import { adminRouter } from "./modules/admin/admin.route";
import { sellerRouter } from "./modules/seller/seller.router";
import { profileRouter } from "./modules/profile/profile.route";
import { blogRoutes } from "./modules/blog/blog.route";

const app: Application = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/medicine", medicineRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/seller", sellerRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/blogs", blogRoutes);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Global Error Handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("GLOBAL ERROR:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;
