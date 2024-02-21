import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { IOrderDetails, OrderRequest } from "./types";
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
    const { order_number, customer, line_items, id, tags }: IOrderDetails =
      body;

    const isAReseller = tags
      .split(",")
      .map((tag) => tag.trim())
      .includes("reseller");

    if (isAReseller) {
      return res.status(201).json({ message: "The user is a reseller." });
    }

    const { installationRequired, installationDetails, isASmartLock } =
      getInstallationDetails(line_items, customer, order_number, id);

    if (!installationRequired || !isASmartLock) {
      return res.status(201).json({
        message:
          "Installation not required, (or is not a smart lock) Entry not added.",
      });
    }
    if (installationRequired && isASmartLock) {
      await callWifyApi(res, installationDetails);
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

    const { order_id, line_items, shipment_status } = json;
    console.log(order_id);

    // if (shipment_status !== "delivered") {
    //   return res.status(201).json({ message: "Order is not delivered yet." });
    // }

    const today = new Date();
    const year = today.getFullYear().toString();
    const day = today.getDate().toString().padStart(2, "0");
    const month = today.getMonth().toString().padStart(2, "0");

    const installationDetails: any = {
      batch_data: [
        {
          "79a88c7b-c64f-46c4-a277-bc80efa1c154": `5770789617839-13569900937391`,
          request_req_date: `${year}-${month}-${day}`,
        },
        {
          "79a88c7b-c64f-46c4-a277-bc80efa1c154": `5770789617839-13569900970159`,
          request_req_date: `${year}-${month}-${day}`,
        },
      ],
    };

    let installationRequired = false;
    let isASmartLock = false;

    // for (const item of line_items as any) {
    //   const isADoorLock =
    //     item.title.toLowerCase().includes("smart") &&
    //     item.title.toLowerCase().includes("lock");

    //   if (!isASmartLock) {
    //     isASmartLock = isADoorLock;
    //   }

    //   if (isADoorLock) {
    //     installationDetails.batch_data.push({
    //       "79a88c7b-c64f-46c4-a277-bc80efa1c154": `5770789617839-${
    //         item.id
    //       }`,
    //       request_req_date: `${year}-${month}-${day}`,
    //     });
    //     continue;
    //   }

    //   if (!installationRequired) {
    //     installationRequired = item.title
    //       .toLowerCase()
    //       .includes("free installation");
    //   }
    // }

    // if (installationRequired && isASmartLock) {
    await callWifyApi(res, installationDetails);
    // }
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
