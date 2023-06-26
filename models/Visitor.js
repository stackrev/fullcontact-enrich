const mongoose = require("mongoose");
const visitorSchema = new mongoose.Schema({
  pid: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

module.exports =
  mongoose.models.Visitor || mongoose.model("Visitor", visitorSchema);
