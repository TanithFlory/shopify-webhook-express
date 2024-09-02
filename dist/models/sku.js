const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SKUSchema = new Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    data: {
        type: [
            {
                type: String,
                required: true,
            },
        ],
    },
});
const SKUModel = mongoose.model("Example", SKUSchema);
module.exports = SKUModel;
//# sourceMappingURL=sku.js.map