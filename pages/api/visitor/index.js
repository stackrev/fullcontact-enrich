import dbConnect from "../../../utils/dbConnect";
import Visitor from "../../../models/Visitor";

dbConnect();

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const visitors = await Visitor.find({});
        res.status(200).json({ success: true, data: visitors });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const visitor = await Visitor.create(req.body);
        res.status(201).json({ success: true, data: visitor });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
