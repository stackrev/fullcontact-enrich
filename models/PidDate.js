const mongoose = require("mongoose");
const piddateSchema = new mongoose.Schema({
  pid: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports =
  mongoose.models.PidDate || mongoose.model("PidDate", piddateSchema);
