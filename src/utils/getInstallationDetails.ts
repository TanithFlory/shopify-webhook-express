import {
  ICustomerDetails,
  IAddress,
  OrderRequest,
  line_items,
  Batch,
} from "../../src/types";
type CustomerPersonDetails = Omit<
  Batch,
  "request_description" | "79a88c7b-c64f-46c4-a277-bc80efa1c154"
>;

export default function getInstallationDetails(
  line_items: line_items,
  customer: ICustomerDetails,
  order_number: number
): {
  installationRequired: boolean;
  installationDetails: OrderRequest;
  isASmartLock: boolean;
} {
  const { first_name, last_name, email, default_address }: ICustomerDetails =
    customer;

  const { address1, address2, city, zip, phone, province }: IAddress =
    default_address;
  const today = new Date();
  const year = today.getFullYear().toString();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString();

  const customerPersonDetails: CustomerPersonDetails = {
    cust_full_name: `${first_name} ${last_name}`,
    cust_mobile: phone,
    cust_city: city,
    cust_line_0: address1,
    cust_line_1: address2 || "",
    cust_line_2: "",
    cust_pincode: zip,
    cust_state: province,
    request_req_date: `${year}-${month}-${day}`,
    request_priority: "Normal",
  };

  const installationDetails: OrderRequest = {
    batch_data: [],
  };

  let installationRequired = false;
  let isASmartLock = false;

  for (const item of line_items as any) {
    const isADoorLock =
      item.title.toLowerCase().includes("smart") &&
      item.title.toLowerCase().includes("lock");

    if (!isASmartLock) {
      isASmartLock = isADoorLock;
    }

    if (isADoorLock) {
      installationDetails.batch_data.push({
        ...customerPersonDetails,
        request_description: `${item.title} - installation`,
        "79a88c7b-c64f-46c4-a277-bc80efa1c154": `${order_number.toString()}-${
          item.id
        }`,
      });
      continue;
    }

    if (!installationRequired) {
      installationRequired = item.title
        .toLowerCase()
        .includes("free installation");
    }
  }

  return { installationRequired, installationDetails, isASmartLock };
}
