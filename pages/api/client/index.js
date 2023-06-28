import dbConnect from "../../../utils/dbConnect";
import Client from "../../../models/Client";
import infoWithEmail from "../../../utils/helpers";

dbConnect();

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const clients = await Client.find({});
        res.status(200).json({ success: true, data: clients });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        let clientData = { ...req.body, email: req.body.email.toLowerCase() };
        const email = clientData.email;

        await Client.find({ email: email }, async (err, clients) => {
          if (clients.length) {
            return res.status(409).json({ success: false, data: clients });
          }
          else {
            // Fetch personId from the Email
            try {
              var myHeaders = new Headers();
              myHeaders.append("Content-Type", "application/json");
              myHeaders.append(
                "Authorization",
                `Bearer ${process.env.ENRICH_API_KEY}`
              );

              var raw = JSON.stringify({
                email: email,
                generatePid: true,
              });

              var requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
              };
              // Send the Email to Enrich API
              const response = await fetch(
                "https://api.fullcontact.com/v3/identity.resolve",
                requestOptions
              );
              const data = await response.json();
              clientData.pid = data.personIds[0];
              const client = await Client.create(clientData);
              res.status(201).json({ success: true, data: client });
            } catch (error) {
              res.status(500).json({ success: false });
            }
          }
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
