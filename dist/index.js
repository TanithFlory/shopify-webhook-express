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
const getRawBody = require("raw-body");
const getInstallationDetails_1 = __importDefault(require("./utils/getInstallationDetails"));
const callWifyApi_1 = require("./utils/callWifyApi");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.get("/", (_req, res) => {
    return res.send("pong 🏓");
});
app.post("/orders-paid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rawBody = yield getRawBody(req);
        const body = JSON.parse(rawBody.toString());
        const { order_number, customer, line_items, id, tags } = body;
        const isAReseller = tags
            .split(",")
            .map((tag) => tag.trim())
            .includes("reseller");
        if (isAReseller) {
            return res.status(201).json({ message: "The user is a reseller." });
        }
        const { installationRequired, installationDetails, isASmartLock } = (0, getInstallationDetails_1.default)(line_items, customer, order_number, id);
        if (!installationRequired || !isASmartLock) {
            return res.status(201).json({
                message: "Installation not required, (or is not a smart lock) Entry not added.",
            });
        }
        if (installationRequired && isASmartLock) {
            yield (0, callWifyApi_1.callWifyApi)(res, installationDetails);
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ Message: "Error" });
    }
}));
app.post("/fulfillment-update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rawBody = yield getRawBody(req);
        const json = JSON.parse(rawBody.toString());
        const { order_id, line_items, shipment_status, updated_at } = json;
        console.log(order_id);
        // if (shipment_status !== "delivered") return;
        const installationDetails = {
            batch_data: [],
        };
        let installationRequired = false;
        let isASmartLock = false;
        for (const item of line_items) {
            const isADoorLock = item.title.toLowerCase().includes("smart") &&
                item.title.toLowerCase().includes("lock");
            if (!isASmartLock) {
                isASmartLock = isADoorLock;
            }
            if (isADoorLock) {
                installationDetails.batch_data.push({
                    "79a88c7b-c64f-46c4-a277-bc80efa1c154": `${order_id.toString()}-${item.id}`,
                    request_req_date: updated_at,
                });
                continue;
            }
            if (!installationRequired) {
                installationRequired = item.title
                    .toLowerCase()
                    .includes("free installation");
            }
        }
        if (installationRequired && isASmartLock) {
            yield (0, callWifyApi_1.callWifyApi)(res, installationDetails);
        }
    }
    catch (error) {
        console.log(error);
    }
}));
app.get("/ping", (_req, res) => {
    return res.send("pong 🏓");
});
app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});
//# sourceMappingURL=index.js.map