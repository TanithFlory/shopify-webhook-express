"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getInstallationDetails(line_items, shipping_address, order_number) {
    const { first_name, last_name, address1, address2, city, zip, phone, province, } = shipping_address;
    const today = new Date();
    const year = today.getFullYear().toString();
    const day = today.getDate().toString().padStart(2, "0");
    let month = today.getMonth() + 1;
    month = (month + 1) % 12;
    if (month === 0) {
        month = 12;
    }
    const customerPersonDetails = {
        cust_full_name: `${first_name} ${last_name}`,
        cust_mobile: revalidatePhone(phone),
        cust_city: city,
        cust_line_0: "",
        cust_line_1: address1,
        cust_line_2: address2,
        cust_pincode: zip,
        cust_state: province,
        request_req_date: `${year}-${month.toString().padStart(2, "0")}-${day}`,
        request_priority: "Normal",
    };
    const installationDetails = {
        batch_data: [],
    };
    // Define two variables. If the second object doesn't have a 'doorlock' property,
    // the previous variable 'isSmartLock' will be overwritten.
    let hasDoorLock = false;
    for (const { title, id } of line_items) {
        const isSmartLock = title.toLowerCase().includes("smart") &&
            title.toLowerCase().includes("lock");
        if (!isSmartLock)
            continue;
        hasDoorLock = true;
        installationDetails.batch_data.push(Object.assign(Object.assign({}, customerPersonDetails), { request_description: `${order_number.toString()} - ${title} - installation`, "79a88c7b-c64f-46c4-a277-bc80efa1c154": `${id}` }));
    }
    return { installationDetails, hasDoorLock };
}
exports.default = getInstallationDetails;
const revalidatePhone = (phone) => {
    let validatedPhone = phone;
    if (phone[0] === "0") {
        validatedPhone = validatedPhone.slice(1);
    }
    return validatedPhone
        .replace(/[-\s]/g, "")
        .replace(/^(\+91)/, "")
        .trim();
};
//# sourceMappingURL=getInstallationDetails.js.map