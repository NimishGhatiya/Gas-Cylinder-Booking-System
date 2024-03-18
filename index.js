const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();

const auth = require("./routes/auth");
const company = require("./routes/company");
const distributor = require("./routes/distributor");
const customer = require("./routes/customer");
const product = require("./routes/product");
const cylinders = require("./routes/cylinders");
const assigned_cylinders = require("./routes/assigned_Cylinders");
const return_cylinders = require("./routes/returncylinder");
const demo = "demo"

app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/company", company);
app.use("/api/distributor", distributor);
app.use("/api/customer", customer);
app.use("/api/product", product);
app.use("/api/cylinders", cylinders);
app.use("/api/assign-cylinders", assigned_cylinders);
app.use("/api/return-cylinders", return_cylinders);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
