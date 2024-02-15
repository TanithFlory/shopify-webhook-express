import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.get("/", (_req: Request, res: Response) => {
  res.send("hi");
});

app.get("/orders-paid", (req: Request, _res: Response) => {
  const body = req.body;

  const { id, current_subtotal_price, order_number, customer } = body;

  const { first_name, last_name, state, email, phone, default_address } =
    customer;

  const { address1, address2, city, country, zip } = default_address;
});

app.get("/ping", (_req: Request, res: Response) => {
  return res.send("pong 🏓");
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
