import express from "express";
import accountsRoutes from "../app/routes/accounts.js";

import mongooseConnection from "./database.js";
mongooseConnection();

const app = express();
app.use(express.json());
app.use("/accounts", accountsRoutes);

export default app;
