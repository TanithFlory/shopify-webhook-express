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
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
function callWifyApi(customer, order_number, line_items) {
    return __awaiter(this, void 0, void 0, function* () {
        const { first_name, last_name, state, email, default_address, } = customer;
        const { address1, address2, city, zip, phone } = default_address;
        const installationDetails = {
            cust_full_name: `${first_name} ${last_name}`,
            cust_mobile: phone,
            cust_city: city,
            cust_line_0: address1,
            cust_line_1: address2 || "",
            cust_line_2: "",
            cust_pincode: zip,
            cust_state: state,
            request_description: `${line_items[0].title} - installation`,
            "79a88c7b-c64f-46c4-a277-bc80efa1c154": order_number.toString(),
            service_provider_id: "315",
            request_req_date: new Date("2022-03-08").toLocaleDateString("en-GB"),
            request_priority: "Normal",
        };
        console.log(installationDetails);
        return;
        const response = yield fetch("https://uat-tms.wify.co.in/", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(installationDetails),
        });
        console.log(response);
    });
}
app.get("/", (_req, res) => {
    return res.send("pong 🏓");
});
app.post("/orders-paid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = yield getRawBody(req);
    const details = JSON.parse(body.toString());
    console.log(details);
    return;
    try {
        if (!req.body) {
            return res
                .status(400)
                .json({ error: "Bad Request - Missing or empty request body" });
        }
        const body = req.body;
        const { order_number, customer, line_items } = body;
        for (const item of line_items) {
            const isMatch = item.toLowerCase().includes("smart") &&
                item.toLowerCase().includes("lock");
            if (!isMatch)
                continue;
            callWifyApi(customer, order_number, line_items);
        }
        return res.status(200).json({ Message: "Success" });
    }
    catch (error) {
        return res.status(500).json({ Message: "Error" });
    }
}));
app.get("/ping", (_req, res) => {
    return res.send("pong 🏓");
});
app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});
//# sourceMappingURL=index.js.map