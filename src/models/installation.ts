import mongoose from "mongoose";

const installationSchema = new mongoose.Schema({
  order_number: {
    type: Number,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  tms_order_id: {
    type: String,
    required: true,
  },
});

export const Installation = mongoose.model("Post", installationSchema);
