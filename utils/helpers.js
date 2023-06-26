exports.infoWithEmail = async function ({ email }) {
  // Fetch personId from the Email
  console.log("email:", email);
  try {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${process.env.ENRICH_API_KEY}`);

    var raw = JSON.stringify({
      email: email,
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
    console.log("data:", data.details.identifiers.personIds);
    return data;
  } catch (error) {
    return {
      status: 500,
      error: error.message,
    };
  }
};
