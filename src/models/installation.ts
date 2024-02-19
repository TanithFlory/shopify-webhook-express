import mongoose from "mongoose";

const installationSchema = new mongoose.Schema({
  tms_order_id: {
    type: String,
    required: true,
  },
  tms_order_status: {
    key: String,
    label: String,
    transition_millis: Number,
  },
  input_data: {
    cust_full_name: String,
    cust_mobile: String,
    cust_city: String,
    cust_line_0: String,
    cust_line_1: String,
    cust_line_2: String,
    cust_pincode: String,
    cust_state: String,
    service_provider_id: String,
    request_req_date: String,
    request_priority: String,
    "79a88c7b-c64f-46c4-a277-bc80efa1c154": String,
    request_description: String,
  },
});

export const Installation = mongoose.model("Installation", installationSchema);
