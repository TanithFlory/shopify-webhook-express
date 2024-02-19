"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getInstallationDetails(line_items, customer, order_number) {
    const { first_name, last_name, email, default_address } = customer;
    const { address1, address2, city, zip, phone, province } = default_address;
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString();
    const customerPersonDetails = {
        cust_full_name: `${first_name} ${last_name}`,
        cust_mobile: phone,
        cust_city: city,
        cust_line_0: address1,
        cust_line_1: address2 || "",
        cust_line_2: "",
        cust_pincode: zip,
        cust_state: province,
        service_provider_id: "315",
        request_req_date: `${year}-${month}-${day}`,
        request_priority: "Normal",
        "79a88c7b-c64f-46c4-a277-bc80efa1c154": order_number.toString(),
    };
    const installationDetails = {
        batch_data: [],
    };
    let installationRequired = false;
    for (const item of line_items) {
        const isADoorLock = item.title.toLowerCase().includes("smart") &&
            item.title.toLowerCase().includes("lock");
        if (isADoorLock) {
            installationDetails.batch_data.push(Object.assign(Object.assign({}, customerPersonDetails), { request_description: `${item.title} - installation` }));
            continue;
        }
        if (!installationRequired) {
            installationRequired = item.title
                .toLowerCase()
                .includes("free installation");
        }
    }
    return { installationRequired, installationDetails };
}
exports.default = getInstallationDetails;
//# sourceMappingURL=getInstallationDetails.js.map