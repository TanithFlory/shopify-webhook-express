import { ITMS_RESPONSE } from "../types";
import mongoConnection from "../db";
import { Installation } from "../models/installation";
import { Response } from "express";

export const newInstallation = async (
  tms_response: ITMS_RESPONSE,
  res: Response
) => {
  try {
    await mongoConnection();
    const response = await Installation.insertMany(tms_response);
    console.log(response);
    return res.status(200).json({ message: "Entry added" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed" });
  }
};
