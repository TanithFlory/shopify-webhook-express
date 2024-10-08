/**
 * Determines whether installation services are required for an order based on its line items
 * and the shipping address. The function evaluates whether the order includes items requiring
 * installation, checks if the shipping pincode is feasible for installation, and returns an
 * object containing installation-related details.
 *
 * @function
 * @param {Array} line_items - The list of line items in the order, where each item is an object
 *                            that may contain installation-related data.
 * @param {Object} shipping_address - The shipping address of the order, containing location details.
 * @param {number} orders_number - The order number that Shopify - Modo uses to determine which customer bought it.
 *
 * @returns {Object} An object containing installation details:
 * @returns {boolean} returns.requiresInstallation - Indicates if installation is required.
 * @returns {boolean} returns.isLocationFeasible - Indicates if the pincode is valid for installation.
 * @returns {Array} returns.installationDetails - A list of items requiring installation.
 *
 *  @property {"83ecad39-bbf0-448c-9b9e-ed43905b730f"}  - Smart Switches or Smart Locks.
 * This UUID refers to the type of product. It can represent categories like 'Smart Switches' or 'Smart Locks.'
 *
 * @property {"5df4b9f0-9601-4223-bea0-f35984d45645"}  - Title of the Smart Switch.
 *
 * @property {"a41f271d-a24c-4c3f-a4ce-689dd7c67113"}  - Title of the Door Lock.
 *
 * @property {"6062b5a9-8338-4757-b559-02c05ca7631f"} - Quantity of Smart Switches.
 *
 * @property {"f45415f7-8c28-42ee-8176-697d119e7554"}  - Variant of the Smart Switch.
 * This UUID refers to the variant of the Smart Switch, used to differentiate between versions or models within the Smart Switch category.
 *
 **/

import { IAddress, OrderRequest, line_items, Batch } from "../../src/types";
type CustomerPersonDetails = Omit<
  Batch,
  "request_description" | "79a88c7b-c64f-46c4-a277-bc80efa1c154"
>;
export default function getInstallationDetails(
  line_items: line_items,
  shipping_address: IAddress,
  order_number: number
): {
  installationDetails: OrderRequest;
  requiresInstallation?: boolean;
  isLocationFeasible?: boolean;
} {
  const {
    first_name,
    last_name,
    address1,
    address2,
    city,
    zip,
    phone,
    province,
  }: IAddress = shipping_address;
  const feasibleDoorLockPin = doorLockPincodes.includes(Number(zip));
  const feasibleSmartSwitchPin = smartSwitchPincodes.includes(Number(zip));

  if (!feasibleDoorLockPin && !feasibleSmartSwitchPin) {
    return { installationDetails: null, isLocationFeasible: false };
  }

  const today = new Date();

  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + 30);

  const futureYear = futureDate.getFullYear().toString();
  const futureMonth = (futureDate.getMonth() + 1).toString().padStart(2, "0");
  const futureDay = futureDate.getDate().toString().padStart(2, "0");

  const customerPersonDetails: CustomerPersonDetails = {
    cust_full_name: `${first_name} ${last_name}`,
    cust_mobile: revalidatePhone(phone),
    cust_city: city,
    cust_line_0: "",
    cust_line_1: address1,
    cust_line_2: address2,
    cust_pincode: zip,
    cust_state: province,
    request_req_date: `${futureYear}-${futureMonth}-${futureDay}`,
    request_priority: "Normal",
  };

  const installationDetails: OrderRequest = {
    batch_data: [],
  };

  let requiresDoorLockInstallation = false;
  let requiresSwitchesInstallation = false;
  const doorLocks = [];
  const smartSwitches = [];
  for (const {
    title,
    sku,
    id,
    variant_title,
    quantity,
  } of line_items as line_items) {
    if (sku === "FI-DL") {
      requiresDoorLockInstallation = true;
      continue;
    }

    if (sku === "FI-SS") {
      requiresSwitchesInstallation = true;
      continue;
    }

    const compatibleDoorLock = doorLockSku.includes(sku);
    const compatibleSwitch = switchesSku.includes(sku);

    if (!compatibleDoorLock && !compatibleSwitch) continue;

    const obj = {
      ...customerPersonDetails,
      request_description: `${order_number.toString()} - ${title} - installation`,
      "79a88c7b-c64f-46c4-a277-bc80efa1c154": `${id}`,
      "6062b5a9-8338-4757-b559-02c05ca7631f": quantity.toString(),
    };

    if (compatibleDoorLock && feasibleDoorLockPin) {
      doorLocks.push({
        ...obj,
        "83ecad39-bbf0-448c-9b9e-ed43905b730f": "Smart Locks",
        "a41f271d-a24c-4c3f-a4ce-689dd7c67113": title,
      });
    }

    if (compatibleSwitch && feasibleSmartSwitchPin) {
      smartSwitches.push({
        ...obj,
        "83ecad39-bbf0-448c-9b9e-ed43905b730f": "Smart Switches",
        "5df4b9f0-9601-4223-bea0-f35984d45645": title,
        "f45415f7-8c28-42ee-8176-697d119e7554": variant_title || "",
      });
    }
  }

  const itemsToAdd = [
    ...(requiresDoorLockInstallation ? doorLocks : []),
    ...(requiresSwitchesInstallation ? smartSwitches : []),
  ];

  installationDetails.batch_data.push(...itemsToAdd);
  return {
    installationDetails,
    requiresInstallation:
      requiresDoorLockInstallation || requiresSwitchesInstallation,
    isLocationFeasible: true,
  };
}

const revalidatePhone = (phone: string) => {
  let validatedPhone = phone;
  if (phone[0] === "0") {
    validatedPhone = validatedPhone.slice(1);
  }
  return validatedPhone
    .replace(/[-\s]/g, "")
    .replace(/^(\+91)/, "")
    .trim();
};

const doorLockPincodes = [
  110050, 110092, 110017, 110059, 110075, 110085, 110034, 110024, 110096,
  110030, 110070, 110025, 110019, 110018, 110074, 110048, 110065, 110091,
  110045, 110049, 110015, 110077, 110009, 110095, 110037, 110021, 110058,
  110062, 110052, 110010, 110014, 110016, 110001, 110078, 110063, 110053,
  110044, 110068, 110060, 110076, 110089, 110008, 110041, 110043, 110051,
  110003, 110007, 110027, 110029, 110088, 110057, 110067, 110002, 110035,
  110032, 110006, 110064, 110066, 110086, 110084, 110054, 110046, 110031,
  110033, 110020, 110026, 110023, 110005, 110087, 110039, 110036, 110082,
  110094, 110047, 110022, 110012, 110042, 110028, 110040, 110038, 110056,
  110055, 110093, 110081, 110013, 110061, 110011, 110080, 110083, 110004,
  110069, 110090, 110097, 110106, 110607, 110108, 110124, 110115, 380058,
  380015, 380013, 380007, 380005, 380051, 380009, 380054, 380061, 380006,
  380008, 380059, 380060, 380016, 380055, 380001, 380050, 380052, 380004,
  380028, 380026, 380014, 380024, 380022, 380063, 380019, 380021, 380027,
  380023, 380010, 380012, 380017, 380002, 380003, 380018, 380025, 380053,
  380056, 380057, 380062, 390005, 390009, 390020, 390002, 390011, 390019,
  390007, 390023, 390016, 390021, 390012, 390001, 390024, 390022, 390010,
  390018, 390014, 390008, 390025, 390004, 390013, 390003, 390006, 390015,
  390017, 122013, 122014, 122019, 122022, 122100, 122001, 122002, 122018,
  122003, 122011, 122017, 122009, 122005, 122006, 122102, 122008, 122016,
  122015, 122007, 122010, 122106, 560031, 560044, 560106, 560107, 560108,
  560037, 560076, 560100, 560068, 560043, 560066, 560102, 560103, 560078,
  560035, 560016, 560067, 560064, 560048, 560093, 560017, 560032, 560075,
  560034, 560062, 560087, 560036, 560049, 560077, 560097, 560085, 560094,
  560008, 560061, 560024, 560029, 560047, 560038, 560060, 560005, 560098,
  560040, 560045, 560092, 560010, 560073, 560072, 560041, 560054, 560071,
  560095, 560091, 560079, 560084, 560070, 560022, 560086, 560011, 560013,
  560050, 560030, 560021, 560090, 560027, 560004, 560033, 560003, 560055,
  560046, 560057, 560015, 560026, 560042, 560001, 560023, 560056, 560065,
  560053, 560058, 560052, 560020, 560069, 560028, 560025, 560019, 560063,
  560039, 560104, 560096, 560018, 560002, 560006, 560080, 560012, 560109,
  560059, 560051, 560009, 560014, 560007, 560081, 560110, 400032, 400035,
  400038, 400039, 400040, 400044, 400046, 400048, 400085, 400087, 400096,
  400609, 400611, 400613, 400011, 400101, 400072, 400607, 400059, 400067,
  400076, 400053, 400037, 400063, 400064, 400078, 400706, 400068, 400093,
  400058, 400097, 400066, 400102, 400050, 400104, 400055, 400080, 400709,
  400060, 400049, 400061, 400071, 400052, 400012, 400103, 400005, 400703,
  400051, 400610, 400022, 400081, 400601, 400056, 400028, 400606, 400054,
  400705, 400095, 400092, 400016, 400070, 400025, 400008, 400086, 400069,
  400026, 400057, 400065, 400089, 400088, 400018, 400074, 400094, 400004,
  400006, 400605, 400099, 400043, 400013, 400604, 400042, 400098, 400091,
  400079, 400602, 400010, 400009, 400014, 400002, 400031, 400077, 400001,
  400007, 400019, 400015, 400033, 400029, 400083, 400075, 400036, 400084,
  400030, 400082, 400034, 400024, 400027, 400020, 400608, 400062, 400003,
  400603, 400021, 400090, 400017, 400023, 400047, 400073, 400218, 400045,
  400100, 400105, 400107, 400108, 400207, 400401, 400547, 400617, 411014,
  411057, 411045, 411028, 411027, 411021, 411041, 411015, 411048, 411038,
  411001, 411033, 411060, 411046, 411036, 411007, 411044, 411052, 411018,
  411058, 411040, 411051, 411009, 411006, 411019, 411047, 411037, 411017,
  411013, 411004, 411061, 410501, 411043, 411005, 411002, 411032, 411023,
  411039, 411031, 411024, 411016, 411008, 411030, 411003, 411012, 411020,
  411026, 410506, 411022, 411011, 411035, 411062, 411034, 411042, 410507,
  401104, 401107, 401208, 401202, 401105, 401209, 401203, 401201, 401101,
  401106, 401207, 401210, 401205, 400703, 400705, 400706, 400709, 400218,
  400611, 400613, 400218, 400611, 400613, 400703, 400705, 400706, 400709,
  500072, 500084, 500049, 500090, 500032, 500089, 500019, 500008, 500081,
  500018, 500050, 500035, 500062, 500015, 500085, 500039, 500055, 500016,
  500070, 500048, 500034, 500075, 500045, 500056, 500076, 500068, 500013,
  500028, 500010, 500047, 500033, 500026, 500020, 500011, 500036, 500059,
  500037, 500083, 500060, 500017, 500009, 500003, 500094, 500080, 500007,
  500027, 500038, 500087, 500092, 500029, 500073, 500091, 500004, 500040,
  500058, 500082, 500054, 500074, 500005, 500044, 500014, 500061, 500025,
  500079, 500086, 500052, 500030, 500098, 500001, 500067, 500046, 500002,
  500088, 500097, 500064, 500012, 500023, 500006, 500063, 500053, 500024,
  500100, 500042, 500057, 500096, 500031, 500077, 500065, 500095, 500051,
  500101, 500069, 500093, 500021, 500022, 500041, 500066, 500071, 502032,
  600105, 600016, 600091, 600089, 600012, 600025, 600015, 600042, 600024,
  600033, 600035, 600093, 600026, 600092, 600028, 600094, 600086, 600006,
  600014, 600018, 600005, 600017, 600034, 600004, 600050, 600045, 600130,
  600043, 600046, 600088, 600061, 600096, 600007, 600039, 600009, 600001,
  600104, 600013, 600081, 600021, 600008, 600020, 600083, 600090, 600032,
  600036, 600078, 600085, 600022, 600113, 600041, 600054, 600077, 600110,
  600066, 600076, 600037, 600087, 600128, 600069, 600059, 600044, 600047,
  600122, 600125, 600048, 600126, 600073, 600116, 600070, 600064, 600075,
  600074, 600119, 600115, 600129, 600040, 600101, 600106, 600099, 600023,
  600031, 600003, 600084, 600082, 600038, 600010, 600107, 600011, 600100,
  600002, 600030, 600102, 600071, 600095, 600123, 600072, 600056, 600058,
  600053, 600057, 600103, 600049, 600118, 600097, 600029, 600079, 600114,
  600112, 600027, 600108, 600111, 600069, 600070, 600123, 600121, 700098,
  700007, 700067, 700108, 700035, 700037, 700052, 700036, 700077, 700080,
  700074, 700105, 700090, 700005, 700003, 700046, 700014, 700054, 700017,
  700010, 700085, 700089, 700011, 700009, 700015, 700012, 700073, 700001,
  700062, 700016, 700069, 700071, 700087, 700072, 700013, 700021, 700045,
  700066, 700038, 700061, 700020, 700099, 700047, 700092, 700040, 700030,
  700004, 700006, 700002, 700050, 700026, 700075, 700041, 700094, 700033,
  700044, 700008, 700023, 700060, 700027, 700053, 700034, 700063, 700024,
  700018, 700029, 700043, 700088, 700019, 700025, 700086, 700031, 700095,
  700078, 700082, 700022, 700032, 700068, 700042, 700028, 700065, 700107,
];

const doorLockSku = [
  "DL-D05D",
  "EL-D02DS",
  "EL-D02DB",
  "DL-D01D",
  "ML-D01D",
  "ZNMS16LM",
  "ZNMS20LM",
  "ZNMS02ES",
];

const switchesSku = [
  "WS-K01D",
  "MS-K01D",
  "ZNQBKG42LMB",
  "ZNQBKG43LMB",
  "ZNQBKG44LMB",
  "ZNQBKG45LMB",
  "ZNQBKG42LMW",
  "ZNQBKG43LMW",
  "ZNQBKG44LMW",
  "ZNQBKG45LMW",
  "MP-K01D",
  "DCM-K01",
  "WS-EUK01",
  "WS-EUK02",
  "WS-EUK03",
  "WS-EUK04",
  "SSM-U01",
  "SSM-U02",
  "QBKG32LM",
];

const smartSwitchPincodes = [
  400067, 400053, 400104, 400064, 400092, 400063, 400066, 400101, 400061,
  400049, 401107, 400091, 400097, 401101, 400058, 400102, 400089, 400037,
  401105, 400072, 400095, 400060, 400017, 400043, 400093, 400055, 400074,
  400056, 400057, 400068, 400071, 400103, 400059, 110092, 401602, 400029,
  401501, 400062, 400069, 411038, 400065, 500050, 500010, 500090, 500035,
  500008, 500089, 400081, 500015, 500055, 500018, 500032, 500028, 500011,
  400050, 500044, 500088, 500033, 500019, 500079, 400076, 500091, 500060,
  500072, 500042, 500084, 500085, 500075, 500062, 500049, 500046, 500039,
  400014, 500009, 500002, 500070, 400086, 500086, 500083, 500059, 500013,
  500097, 500047, 500027, 500040, 500098, 500073, 500080, 500081, 400013,
  500074, 400052, 500003, 400078, 500048, 500045, 400015, 500076, 500034,
  400025, 400709, 500061, 500082, 500026, 400028, 400024, 400708, 500093,
  400005, 500043, 400051, 500014, 500016, 500004, 500068, 500087, 500017,
  500020, 401107, 500029, 400022, 500094, 400070, 500036, 400042, 500037,
  500038, 500064, 500058, 500092,
];
