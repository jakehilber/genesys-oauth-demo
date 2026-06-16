
const clientId = "YOUR_CLIENT_ID";
const redirectUri = "http://localhost:3000/callback";
const region = "us-east-1"; // ✅ FIXED format

// ✅ FIXED template string
const authUrl = `https://login.${region}.pure.cloud/oauth/authorize`;

document.getElementById("loginBtn").addEventListener("click", () => {
  const url =
    `${authUrl}?response_type=code` +
    `&client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;

  window.location.href = url;
});

// Handle redirect back with ?code=
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (code) {
  fetch(`/api/token?code=${code}`)
    .then(res => res.json())
    .then(data => {

      // ✅ ✅ ADD REDIRECT HERE
      if (data.access_token) {
        window.location.href =
          "success.html?token=" + encodeURIComponent(data.access_token);
      }

      // (optional fallback display)
      document.getElementById("result").innerText =
        JSON.stringify(data, null, 2);
    })
    .catch(err => console.error(err));
}
