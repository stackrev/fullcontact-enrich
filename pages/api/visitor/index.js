import dbConnect from "../../../utils/dbConnect";
import Visitor from "../../../models/Visitor";
import infoWithEmail from "../../../utils/helpers";

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
        let visitorData = req.body;
        const email = req.body.email;

        await Visitor.find({ email: email }, (err, visitors) => {
          if (visitors.length){
            res.status(409).json({ success: false, data: visitors });
            return;
          }
        });

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
          visitorData.pid = data.personIds[0];
          const visitor = await Visitor.create(visitorData);
          res.status(201).json({ success: true, data: visitor });
        } catch (error) {
          res.status(500).json({ success: false });
        }

        // get response with the email

        // const result = await infoWithEmail({ email });

        // console.log("result", result);
        // console.log("data:", data.details.identifiers.personIds);
        // visitorData.info = result;
        // visitorData.pid = result.details.identifiers.personIds[0];
        // visitorData.recordId = result.details.identifiers.recordIds[0];
        // const visitor = await Visitor.create(visitorData);
        // res.status(201).json({ success: true, data: visitor });
      } catch (error) {
        res.status(500).json({ success: false });
      }
      break;
    default:
      res.status(500).json({ success: false });
      break;
  }
};
