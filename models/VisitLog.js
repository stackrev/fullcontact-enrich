const mongoose = require("mongoose");
const visitlogSchema = new mongoose.Schema({
  pid: {
    type: String,
  },
  maid: {
    type: String,
  },
  ip: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
  },
});

module.exports =
  mongoose.models.VisitLog || mongoose.model("VisitLog", visitlogSchema);
