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
exports.newInstallation = void 0;
const db_1 = __importDefault(require("../db"));
const installation_1 = require("../models/installation");
const newInstallation = (order_number, id, tms_order_id, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.default)();
        const installation = new installation_1.Installation({
            order_number,
            id,
            tms_order_id,
        });
        yield installation.save();
        return res.status(200).json({ message: "Entry added" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed" });
    }
});
exports.newInstallation = newInstallation;
//# sourceMappingURL=installationController.js.map