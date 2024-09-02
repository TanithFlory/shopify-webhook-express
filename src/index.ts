import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { IOrderDetails } from "./types";
import getInstallationDetails from "./utils/getInstallationDetails";
import { callWifyApi } from "./utils/callWifyApi";
import getRawBody from "raw-body";
import path = require("path");

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.get("/", (_req: Request, res: Response) => {
  console.log(path.join(__dirname, "/index.html"));
  return res.sendFile(path.join(__dirname, "/index.html"));
});

app.post("/orders-paid", async (req: Request, res: Response) => {
  try {
    const rawBody = await getRawBody(req);
    const body = JSON.parse(rawBody.toString());
    const { order_number, shipping_address, line_items }: IOrderDetails = body;

    const { installationDetails, requiresInstallation, isLocationFeasible } =
      getInstallationDetails(line_items, shipping_address, order_number);

    if (!isLocationFeasible) {
      return res.status(201).json({
        message: "Pincode is out of feasible locations",
      });
    }

    if (!requiresInstallation) {
      return res.status(201).json({
        message: "Given product doesn't qualify for installation.",
      });
    }

    await callWifyApi(res, installationDetails);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ Message: "Error" });
  }
});

// app.post("/fulfillment-update", async (req: Request, res: Response) => {
//   try {
//     const rawBody = await getRawBody(req);
//     const body = JSON.parse(rawBody.toString());

//     const { line_items, shipment_status } = body;

//     if (shipment_status !== "delivered") {
//       return res.status(201).json({ message: "Order is not delivered yet." });
//     }
//     await mongoConnection();

//     const today = new Date();
//     const nextDay = new Date(today);
//     nextDay.setDate(today.getDate() + 1);

//     const year = nextDay.getFullYear().toString();
//     const day = nextDay.getDate().toString().padStart(2, "0");
//     const month = nextDay.getMonth() + 1;

//     const installationDetails: any = {
//       batch_data: [],
//     };

//     let installationRequired = false;
//     let isASmartLock = false;

//     for (const item of line_items as any) {
//       const isADoorLock =
//         item.title.toLowerCase().includes("smart") &&
//         item.title.toLowerCase().includes("lock");

//       if (!isASmartLock) {
//         isASmartLock = isADoorLock;
//       }

//       if (isADoorLock) {
//         const response = await Installation.findOne({
//           "79a88c7b-c64f-46c4-a277-bc80efa1c154": item.id,
//         });
//         installationDetails.batch_data.push({
//           "79a88c7b-c64f-46c4-a277-bc80efa1c154": `${item.id}`,
//           request_req_date: `${year}-${month
//             .toString()
//             .padStart(2, "0")}-${day}`,
//         });
//         continue;
//       }

//       if (!installationRequired) {
//         installationRequired = item.title
//           .toLowerCase()
//           .includes("free installation");
//       }
//     }
//     if (installationRequired && isASmartLock) {
//       await callWifyApi(res, installationDetails);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

app.get("/ping", (_req: Request, res: Response) => {
  return res.send("pong 🏓 ver 2.0");
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
