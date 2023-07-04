const mongoose = require("mongoose");
const clientSchema = new mongoose.Schema({
  pid: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  maids: {
    type: Array,
  },
});

module.exports =
  mongoose.models.Client || mongoose.model("Client", clientSchema);
