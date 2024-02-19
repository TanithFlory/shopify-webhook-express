"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Installation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const installationSchema = new mongoose_1.default.Schema({
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
exports.Installation = mongoose_1.default.model("Post", installationSchema);
//# sourceMappingURL=installation.js.map