import mongoConnection from "../db";
import { Installation } from "../models/installation";
import { Response } from "express";

export const newInstallation = async (
  order_number: number,
  id: number,
  tms_order_id: string,
  res: Response
) => {
  try {
    await mongoConnection();

    const installation = new Installation({
      order_number,
      id,
      tms_order_id,
    });

    await installation.save();

    return res.status(200).json({ message: "Entry added" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed" });
  }
};
