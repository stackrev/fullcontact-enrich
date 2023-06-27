import dbConnect from "../../../utils/dbConnect";
import Visitor from "../../../models/Visitor";

dbConnect();

export default async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const visitor = await Visitor.findById(id);
        if (!visitor) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: visitor });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "PUT":
      try {
        const visitor = await Visitor.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!visitor) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: visitor });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const deletedVisitor = await Visitor.deleteOne({ _id: id });

        if (!deletedVisitor) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};
