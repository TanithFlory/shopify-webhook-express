import { newInstallation } from "../controllers/installationController";
import { OrderRequest } from "../types";
import { Response } from "express";

export async function callWifyApi(
  res: Response,
  installationDetails: OrderRequest,
  dontSaveDb?: boolean
) {
  try {
    const response = await fetch(
      "https://api-tms.wify.co.in/v1/brands/order/1109/",
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

    const responseText = await response.text();
    const responseData = await JSON.parse(responseText);
    console.log(responseData);
    if (dontSaveDb) {
      return res.status(200);
    }

    await newInstallation(responseData.data.resp, res);
  } catch (error) {
    console.log(error);
  }
}
