import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { IOrderDetails } from "./types";
import getRawBody = require("raw-body");
import getInstallationDetails from "./utils/getInstallationDetails";
import { callWifyApi } from "./utils/callWifyApi";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.get("/", (_req: Request, res: Response) => {
  return res.send("pong 🏓");
});

app.post("/orders-paid", async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    return;
    const rawBody = await getRawBody(req);
    const body = JSON.parse(rawBody.toString());
    const { order_number, customer, line_items, id }: IOrderDetails = body;
    console.log(body);
    const { installationRequired, installationDetails } =
      getInstallationDetails(line_items, customer, order_number);

    if (installationRequired) {
      await callWifyApi(order_number, id, res, installationDetails);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ Message: "Error" });
  }
});

app.get("/ping", (_req: Request, res: Response) => {
  return res.send("pong 🏓");
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
