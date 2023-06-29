import dbConnect from "../../../utils/dbConnect";
import Client from "../../../models/Client";

dbConnect();

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { page = 1, limit = 10 } = req.query;
        const recordsCount = await Client.count({});
        const start = (page - 1) * limit;

        const clients = await Client.find({}, null, {
          skip: start,
          limit: parseInt(limit),
        });
        res.status(200).json({
          success: true,
          data: {
            activePage: page,
            pagesCount: Math.ceil(recordsCount / limit),
            recordsCount: recordsCount,
            clients: clients,
          },
        });
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
          } else {
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
                dataFilter: ["resolve", "maid_amplification"],
                generatePid: true,
                //                maxMaids: 20,
              });

              var requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
              };
              // Send the Email to Enrich API
              const response = await fetch(
                "https://api.fullcontact.com/v3/person.enrich",
                requestOptions
              );
              const data = await response.json();
              clientData.pid = data.details.identifiers.personIds[0];
              clientData.maids = data.details.identifiers.maids;
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
