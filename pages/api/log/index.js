import dbConnect from "../../../utils/dbConnect";
import VisitLog from "../../../models/VisitLog";
import PidDate from "../../../models/PidDate";
import Client from "../../../models/Client";
const API_URL = "http://localhost:3001"; // Update with the Socket.IO server URL

dbConnect();
export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const totalResult = await VisitLog.aggregate([
          {
            $group: {
              _id: "$pid",
              count: { $sum: 1 },
            },
          },
          {
            $group: {
              _id: null,
              uniquePersonCount: { $sum: 1 },
            },
          },
        ]).exec();

        const anonyResult = await VisitLog.aggregate([
          {
            $match: {
              email: "Anony",
            },
          },
          {
            $group: {
              _id: "$pid",
              count: { $sum: 1 },
            },
          },
          {
            $group: {
              _id: null,
              uniquePersonCount: { $sum: 1 },
            },
          },
        ]).exec();

        const visitlogs = await VisitLog.find({});
        res.status(200).json({
          success: true,
          data: {
            visitlogs: visitlogs,
            totalCount: totalResult[0].uniquePersonCount,
            anonyCount: anonyResult[0].uniquePersonCount,
          },
        });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const { pid, date, ip } = req.body;
        // Verify that both pid and date were provided
        if (!pid || !date || !ip) {
          res.status(400).json({
            error:
              "Request body must contain all of those a pid, a date and a ip",
          });
          return;
        }

        const currentDate = new Date(date);

        await PidDate.findOne({ pid: pid }, async (err, pidDate) => {
          if (pidDate) {
            if (currentDate.getTime() - pidDate.date.getTime() < 60 * 1000) {
              await PidDate.findByIdAndUpdate(
                pidDate._id,
                { pid: pid, date: currentDate },
                {
                  new: true,
                  runValidators: true,
                }
              );
              return res.status(409).json({ message: "Duplicated" });
            } else {
              await PidDate.findByIdAndUpdate(
                pidDate._id,
                { pid: pid, date: currentDate },
                {
                  new: true,
                  runValidators: true,
                }
              );
            }
          } else {
            await PidDate.create({ pid: pid, date: currentDate });
          }
          // Do something with the pid and date here
          await Client.findOne({ pid: pid }, (err, client) => {
            if (client) {
              VisitLog.create({ ...req.body, email: client.email });
            } else {
              VisitLog.create({ ...req.body, email: "Anony" });
            }
          });

          // Send a response back to the client
          res.status(201).json({ success: true });
        });
      } catch (error) {
        res.status(500).json({ success: false });
      }
      break;
    default:
      res.status(500).json({ success: false });
      break;
  }
};
