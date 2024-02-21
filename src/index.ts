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
    const rawBody = await getRawBody(req);
    const body = JSON.parse(rawBody.toString());
    const { order_number, customer, line_items, id }: IOrderDetails = body;
    const { installationRequired, installationDetails, isASmartLock } =
      getInstallationDetails(line_items, customer, order_number);
    if (!installationRequired || !isASmartLock) {
      return res.status(201).json({
        message:
          "Installation not required, (or is not a smart lock) Entry not added.",
      });
    }
    if (installationRequired && isASmartLock) {
      await callWifyApi(order_number, id, res, installationDetails);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ Message: "Error" });
  }
});

app.post("/fulfillment-update", async (req: Request, res: Response) => {
  try {
    const rawBody = await getRawBody(req);
    const json = JSON.parse(rawBody.toString());
    console.log(json.order_id, json.shipment_status);
  } catch (error) {
    console.log(error);
  }
});

app.get("/ping", (_req: Request, res: Response) => {
  return res.send("pong 🏓");
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
