"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const getInstallationDetails_1 = __importDefault(require("./utils/getInstallationDetails"));
const callWifyApi_1 = require("./utils/callWifyApi");
const raw_body_1 = __importDefault(require("raw-body"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.get("/", (_req, res) => {
    return res.send("pong 🏓");
});
app.post("/orders-paid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rawBody = yield (0, raw_body_1.default)(req);
        const body = JSON.parse(rawBody.toString());
        const { order_number, shipping_address, line_items } = body;
        const { installationDetails, hasDoorLock } = (0, getInstallationDetails_1.default)(line_items, shipping_address, order_number);
        if (!hasDoorLock) {
            return res.status(201).json({
                message: "Given item is not a doorlock. Entry not added.",
            });
        }
        yield (0, callWifyApi_1.callWifyApi)(res, installationDetails);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ Message: "Error" });
    }
}));
// app.post("/fulfillment-update", async (req: Request, res: Response) => {
//   try {
//     const rawBody = await getRawBody(req);
//     const body = JSON.parse(rawBody.toString());
//     const { line_items, shipment_status } = body;
//     if (shipment_status !== "delivered") {
//       return res.status(201).json({ message: "Order is not delivered yet." });
//     }
//     await mongoConnection();
//     const today = new Date();
//     const nextDay = new Date(today);
//     nextDay.setDate(today.getDate() + 1);
//     const year = nextDay.getFullYear().toString();
//     const day = nextDay.getDate().toString().padStart(2, "0");
//     const month = nextDay.getMonth() + 1;
//     const installationDetails: any = {
//       batch_data: [],
//     };
//     let installationRequired = false;
//     let isASmartLock = false;
//     for (const item of line_items as any) {
//       const isADoorLock =
//         item.title.toLowerCase().includes("smart") &&
//         item.title.toLowerCase().includes("lock");
//       if (!isASmartLock) {
//         isASmartLock = isADoorLock;
//       }
//       if (isADoorLock) {
//         const response = await Installation.findOne({
//           "79a88c7b-c64f-46c4-a277-bc80efa1c154": item.id,
//         });
//         installationDetails.batch_data.push({
//           "79a88c7b-c64f-46c4-a277-bc80efa1c154": `${item.id}`,
//           request_req_date: `${year}-${month
//             .toString()
//             .padStart(2, "0")}-${day}`,
//         });
//         continue;
//       }
//       if (!installationRequired) {
//         installationRequired = item.title
//           .toLowerCase()
//           .includes("free installation");
//       }
//     }
//     if (installationRequired && isASmartLock) {
//       await callWifyApi(res, installationDetails);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });
app.get("/ping", (_req, res) => {
    return res.send("pong 🏓");
});
app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});
//# sourceMappingURL=index.js.map