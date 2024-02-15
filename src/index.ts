import express, { Request, Response } from "express";
import dotenv from "dotenv";
import {
  IAddress,
  ICustomerDetails,
  IOrderDetails,
  OrderRequest,
  line_items,
} from "./types";
import getRawBody = require("raw-body");
import bodyParser = require("body-parser");

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function callWifyApi(
  customer: ICustomerDetails,
  order_number: number,
  line_items: line_items
) {
  const {
    first_name,
    last_name,
    state,
    email,
    default_address,
  }: ICustomerDetails = customer;

  const { address1, address2, city, zip, phone }: IAddress = default_address;

  const installationDetails: OrderRequest = {
    cust_full_name: `${first_name} ${last_name}`,
    cust_mobile: phone,
    cust_city: city,
    cust_line_0: address1,
    cust_line_1: address2 || "",
    cust_line_2: "",
    cust_pincode: zip,
    cust_state: state,
    request_description: `${(line_items as any)[0].title} - installation`,
    "79a88c7b-c64f-46c4-a277-bc80efa1c154": order_number.toString(),
    service_provider_id: "315",
    request_req_date: new Date("2022-03-08").toLocaleDateString("en-GB"),
    request_priority: "Normal",
  };

  console.log(installationDetails);

  return;
  const response = await fetch("https://uat-tms.wify.co.in/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(installationDetails),
  });

  console.log(response);
}

app.get("/", (_req: Request, res: Response) => {
  return res.send("pong 🏓");
});

app.post("/orders-paid", async (req: Request, res: Response) => {
  try {
    const rawBody = await getRawBody(req);
    const body = JSON.parse(rawBody.toString());
    const { order_number, customer, line_items }: IOrderDetails = body;

    for (const item of line_items as any) {
      const isMatch =
        item.title.toLowerCase().includes("smart") &&
        item.title.toLowerCase().includes("lock");

      if (!isMatch) continue;

      callWifyApi(customer, order_number, line_items);
    }
    return res.status(200).json({ Message: "Success" });
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
