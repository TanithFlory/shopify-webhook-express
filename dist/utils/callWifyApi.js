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
Object.defineProperty(exports, "__esModule", { value: true });
exports.callWifyApi = void 0;
function callWifyApi(res, installationDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("https://api-tms.wify.co.in/v1/brands/order/1109/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                    accept: "*/*",
                },
                body: JSON.stringify(installationDetails),
            });
            if (!response)
                return res.status(500).json({ message: "Error from tms" });
            const responseText = yield response.text();
            console.log(responseText);
            if (!responseText)
                return res.status(500).json({ message: "Error from tms" });
            return res.status(200).json({ message: "Entry added" });
            // const responseData = await JSON.parse(responseText);
            // await newInstallation(responseData.data.resp, res);
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.callWifyApi = callWifyApi;
//# sourceMappingURL=callWifyApi.js.map