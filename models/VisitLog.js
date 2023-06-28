const mongoose = require("mongoose");
const visitlogSchema = new mongoose.Schema({
  pid: {
    type: String,
    required: true,
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
