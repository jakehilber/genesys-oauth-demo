const clientId = "YOUR_CLIENT_ID";
const redirectUri = "http://localhost:3000/callback";
const region = "us_east_1"; // adjust (e.g., eu_west_1)

// Genesys authorize endpoint
const authUrl = https://login.${region}.pure.cloud/oauth/authorize;

document.getElementById("loginBtn").addEventListener("click", () => {
  const url =
    ${authUrl}?response_type=code +
    &amp;client_id=${clientId} +
    &amp;redirect_uri=${encodeURIComponent(redirectUri)};

  window.location.href = url;
});

// Handle redirect back with ?code=
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (code) {
  fetch(/api/token?code=${code})
    .then(res => res.json())
    .then(data => {
      document.getElementById("result").innerText =
        JSON.stringify(data, null, 2);
    })
    .catch(err => console.error(err));
}
