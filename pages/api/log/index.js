import dbConnect from "../../../utils/dbConnect";
import Client from "../../../models/Client";
import socketIOClient from 'socket.io-client';
const API_URL = 'http://localhost:3001'; // Update with the Socket.IO server URL

dbConnect();
let recent_history = [];
export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        res.status(200).json({ success: true, data: "success" });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      console.log("post:", req.body);
      try {
        const { pid, date } = req.body;
        // Verify that both pid and date were provided
        if (!pid || !date) {
          res.status(400).json({ error: 'Request body must contain all of those a pid, a date and a type' });
          return;
        }

        const date1 = new Date(recent_history[pid]);
        const date2 = new Date(date);

        console.log(date1, date2);

        if (recent_history[pid] && date2.getTime() - date1.getTime() < 3600 * 1000) {
          recent_history[pid] = date;
          return res.json({ status: 'success', message: 'Data duplicated so ignored' });
        }
        recent_history[pid] = date;

        let sendData = {...req.body, email: "Anony"};
        // Do something with the pid and date here
        console.log(pid, date);
        await Client.findOne({ pid: pid }, (err, client) => {
          if (client){
            sendData = {...sendData, email: client.email};
          }
        });

        const socket = socketIOClient(API_URL);

        // Emit the POST data to the Socket.IO server
        socket.emit('postData', sendData);


        // Send a response back to the client
        res.status(201).json({ success: 'Data received' });
      } catch (error) {
        res.status(500).json({ success: false });
      }
      break;
    default:
      res.status(500).json({ success: false });
      break;
  }
};
