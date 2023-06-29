const mongoose = require("mongoose");
const keydateSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports =
  mongoose.models.KeyDate || mongoose.model("KeyDate", keydateSchema);
