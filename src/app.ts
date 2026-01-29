import express, { Application } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { medicineRouter } from "./modules/medicine/medicine.route";
import { customerRouter } from "./modules/customer/customer.router";

const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true,
  }),
);

app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/customer", customerRouter);

app.use("/api/v1/medicine", medicineRouter);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;
