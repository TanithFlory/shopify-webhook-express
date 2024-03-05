export interface IOrderDetails {
  id: number;
  current_subtotal_price: string;
  order_number: number;
  customer: ICustomerDetails;
  line_items: line_items;
  tags: string;
  shipping_address: IAddress;
}
export type line_items = IProduct[];

export interface IProduct {
  product_id: number;
  title: string;
  quantity: string;
}

export interface ICustomerDetails {
  first_name: string;
  last_name: string;
  email: string;
  default_address: IAddress;
}

export interface IAddress {
  first_name: string;
  last_name: string;
  address1: string;
  address2?: string;
  city: string;
  phone: string;
  province: string;
  zip: string;
}

export type OrderRequest = {
  batch_data: Batch[];
};

export type Batch = {
  cust_mobile: string;
  cust_full_name: string;
  cust_line_0: string;
  cust_line_1: string;
  cust_line_2: string;
  cust_pincode: string;
  cust_city: string;
  cust_state: string;
  "79a88c7b-c64f-46c4-a277-bc80efa1c154": string;
  request_description: string;
  request_req_date: string;
  request_priority: "Normal";
};

export interface ITMS_RESPONSE {
  tms_order_id: string;
  input_data: {
    "79a88c7b-c64f-46c4-a277-bc80efa1c154": string;
  };
}
