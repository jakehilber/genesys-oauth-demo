
const clientId = "YOUR_CLIENT_ID";
const region = "us-east-1";

// GitHub Pages-safe redirect
const redirectUri = window.location.origin + window.location.pathname;

const authUrl = `https://login.${region}.pure.cloud/oauth/authorize`;
const tokenUrl = `https://login.${region}.pure.cloud/oauth/token`;

// LOGIN BUTTON
document.getElementById("loginBtn").addEventListener("click", async () => {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await sha256ToBase64Url(codeVerifier);

  // store for later
  sessionStorage.setItem("code_verifier", codeVerifier);

  const url =
    `${authUrl}?response_type=code` +
    `&client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&code_challenge=${codeChallenge}` +
    `&code_challenge_method=S256`;

  window.location.href = url;
});

// HANDLE REDIRECT BACK
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (code) {
  const codeVerifier = sessionStorage.getItem("code_verifier");

  fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body:
      `grant_type=authorization_code` +
      `&client_id=${clientId}` +
      `&code=${code}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&code_verifier=${codeVerifier}`
  })
    .then(res => res.json())
    .then(data => {
      if (data.access_token) {
        // ✅ SUCCESS REDIRECT
        window.location.href =
          "success.html?token=" + encodeURIComponent(data.access_token);
      } else {
        document.getElementById("result").innerText =
          JSON.stringify(data, null, 2);
      }
    })
    .catch(err => console.error("Token error:", err));
}

// HELPERS
function generateRandomString(length) {
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec => dec.toString(36)).join("");
}

async function sha256ToBase64Url(str) {
  const data = new TextEncoder().encode(str);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
