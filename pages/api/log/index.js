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
        const visitlogs = await VisitLog.find({});
        res.status(200).json({ success: true, data: visitlogs });
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
            if (currentDate.getTime() - pidDate.date.getTime() < 3600 * 1000) {
              await PidDate.findByIdAndUpdate(
                pidDate._id,
                { ...pidDate, date: currentDate },
                {
                  new: true,
                  runValidators: true,
                }
              );
              return res.status(409).json({ message: "Duplicated" });
            } else {
              await PidDate.findByIdAndUpdate(
                pidDate._id,
                { ...pidDate, date: currentDate },
                {
                  new: true,
                  runValidators: true,
                }
              );
            }
          } else {
            await PidDate.create({ pid: pid, date: currentDate });
          }
        });

        let sendData = { ...req.body, email: "Anony" };
        // Do something with the pid and date here
        await Client.findOne({ pid: pid }, (err, client) => {
          if (client) {
            sendData = { ...sendData, email: client.email };
          }
        });

        //        const socket = socketIOClient(API_URL);

        // Emit the POST data to the Socket.IO server
        // socket.emit('postData', sendData);
        console.log(sendData);
        const visitLog = VisitLog.create(sendData);

        // Send a response back to the client
        res.status(201).json({ success: true, data: visitLog });
      } catch (error) {
        res.status(500).json({ success: false });
      }
      break;
    default:
      res.status(500).json({ success: false });
      break;
  }
};
