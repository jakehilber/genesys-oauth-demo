const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = 3000;

const region = process.env.GENESYS_REGION;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;

// Serve static files
app.use(express.static("public"));

// Endpoint to exchange auth code for token
app.get("/api/token", async (req, res) => {
  const code = req.query.code;

  try {
    const tokenResponse = await fetch(
      https://login.${region}.pure.cloud/oauth/token,
      {
        method: "POST",
        headers: {
          "Authorization":
            "Basic " +
            Buffer.from(clientId + ":" + clientSecret).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: redirectUri
        })
      }
    );

    const data = await tokenResponse.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(Server running on http://localhost:${PORT});
});
