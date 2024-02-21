"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getInstallationDetails(line_items, customer, order_number, id) {
    const { first_name, last_name, email, default_address } = customer;
    const { address1, address2, city, zip, phone, province } = default_address;
    const today = new Date();
    const year = today.getFullYear().toString();
    const day = today.getDate().toString();
    let month = today.getMonth() + 1;
    month = (month + 1) % 12;
    if (month === 0) {
        month = 12; // Set it to December
    }
    console.log(year, month, day);
    const customerPersonDetails = {
        cust_full_name: `${first_name} ${last_name}`,
        cust_mobile: phone,
        cust_city: city,
        cust_line_0: address1,
        cust_line_1: address2 || "",
        cust_line_2: "",
        cust_pincode: zip,
        cust_state: province,
        request_req_date: `${year}-0${month.toString()}-${day}`,
        request_priority: "Normal",
    };
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
            installationDetails.batch_data.push(Object.assign(Object.assign({}, customerPersonDetails), { request_description: `${order_number.toString()} - ${item.title} - installation`, "79a88c7b-c64f-46c4-a277-bc80efa1c154": `${id.toString()}-${item.id}` }));
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
exports.default = getInstallationDetails;
//# sourceMappingURL=getInstallationDetails.js.map