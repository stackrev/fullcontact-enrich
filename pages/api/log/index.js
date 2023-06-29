import dbConnect from "../../../utils/dbConnect";
import VisitLog from "../../../models/VisitLog";
import KeyDate from "../../../models/KeyDate";
import Client from "../../../models/Client";
const API_URL = "http://localhost:3001"; // Update with the Socket.IO server URL

dbConnect();
export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { page = 1, limit = 10, isrecogonly = false } = req.query;
        console.log(req.query);
        const totalResult = await VisitLog.aggregate([
          {
            $group: {
              _id: "$ip",
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

        const recogResult = await VisitLog.aggregate([
          {
            $match: {
              email: { $ne: "Anony" },
            },
          },
          {
            $group: {
              _id: "$ip",
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

        const recordsCount = await VisitLog.count(
          isrecogonly === "true" ? { email: { $ne: "Anony" } } : {}
        );
        const start = (page - 1) * limit;

        const visitlogs = await VisitLog.find(
          isrecogonly === "true" ? { email: { $ne: "Anony" } } : {},
          null,
          {
            skip: start,
            limit: parseInt(limit),
          }
        );
        res.status(200).json({
          success: true,
          data: {
            isRecogOnly: isrecogonly,
            activePage: page,
            pagesCount: Math.ceil(recordsCount / limit),
            visitlogs: visitlogs,
            totalCount: totalResult[0].uniquePersonCount,
            recogCount: recogResult[0].uniquePersonCount,
          },
        });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        let { type, key, date, ip } = req.body;
        // Verify that both pid and date were provided
        if (!type || !key || !date || !ip) {
          res.status(400).json({
            error:
              "Request body must contain all of those a type, a key, a date and a ip",
          });
          return;
        }
        if (type === "maid") {
          const urlParams = new URLSearchParams(key);
          key = urlParams.get("maid");
        }

        const currentDate = new Date(date);

        await KeyDate.findOne({ key: key }, async (err, keyDate) => {
          if (keyDate) {
            if (currentDate.getTime() - keyDate.date.getTime() < 60 * 1000) {
              await KeyDate.findByIdAndUpdate(
                keyDate._id,
                { key: key, date: currentDate },
                {
                  new: true,
                  runValidators: true,
                }
              );
              return res.status(409).json({ message: "Duplicated" });
            } else {
              await KeyDate.findByIdAndUpdate(
                keyDate._id,
                { key: key, date: currentDate },
                {
                  new: true,
                  runValidators: true,
                }
              );
            }
          } else {
            await KeyDate.create({ key: key, date: currentDate });
          }
          // Do something with the pid and date here
          if (type == "pid") {
            await Client.findOne({ pid: key }, (err, client) => {
              if (client) {
                VisitLog.create({ ...req.body, pid: key, email: client.email });
              } else {
                VisitLog.create({ ...req.body, pid: key, email: "Anony" });
              }
            });
          } else if (type == "maid") {
            await Client.findOne({ "maids.id": key }, (err, client) => {
              if (client) {
                VisitLog.create({
                  ...req.body,
                  maid: key,
                  email: client.email,
                });
              } else {
                VisitLog.create({ ...req.body, maid: key, email: "Anony" });
              }
            });
          }

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
