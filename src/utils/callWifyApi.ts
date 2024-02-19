import { newInstallation } from "../controllers/installationController";
import { Batch, OrderRequest } from "../types";
import { Response } from "express";

export async function callWifyApi(
  order_number: number,
  id: number,
  res: Response,
  installationDetails: OrderRequest
) {
  try {
    const response = await fetch(
      "https://uat-tms.wify.co.in/mockups/brands/order/315",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify(installationDetails),
      }
    );
    if (!response) return;

    const responseData = await response.json();
    await newInstallation(responseData.data.resp, res);
  } catch (error) {
    console.log(error);
  }
}
