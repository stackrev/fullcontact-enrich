const mongoose = require("mongoose");
const clientSchema = new mongoose.Schema({
  pid: {
    type: String,
  },
  recordId: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
});

module.exports =
  mongoose.models.Client || mongoose.model("Client", clientSchema);
