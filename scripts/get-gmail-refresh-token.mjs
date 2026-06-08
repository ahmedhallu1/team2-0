/**
 * One-time helper to mint a Gmail OAuth2 refresh token for the contact form.
 *
 * Prerequisites (do this once in Google Cloud Console for the project that
 * owns your web OAuth client):
 *   1. APIs & Services → Library → enable "Gmail API".
 *   2. APIs & Services → OAuth consent screen → add the scope
 *      ".../auth/gmail.send", and add the Gmail account you'll send from as a
 *      "Test user" (if the app is in "Testing").
 *   3. APIs & Services → Credentials → open your Web client → under
 *      "Authorized redirect URIs" add exactly:  http://localhost:5555/oauth2callback
 *
 * Then, with GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET present in .env.local
 * (or your shell env), run:
 *
 *   node scripts/get-gmail-refresh-token.mjs
 *
 * A browser window opens, you consent with the Gmail account you want to send
 * from, and the script prints a GMAIL_REFRESH_TOKEN to paste into .env.local.
 */

import http from "node:http";
import { readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { URL } from "node:url";

const REDIRECT_URI = "http://localhost:5555/oauth2callback";
const PORT = 5555;
const SCOPE = "https://www.googleapis.com/auth/gmail.send";

function loadEnvLocal() {
  const env = {};
  try {
    const raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* .env.local optional */
  }
  return env;
}

const fileEnv = loadEnvLocal();
const CLIENT_ID = process.env.GMAIL_CLIENT_ID || fileEnv.GMAIL_CLIENT_ID;
const CLIENT_SECRET =
  process.env.GMAIL_CLIENT_SECRET || fileEnv.GMAIL_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "\n✗ GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET must be set in .env.local (or your shell env).\n",
  );
  process.exit(1);
}

const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
authUrl.searchParams.set("client_id", CLIENT_ID);
authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("scope", SCOPE);
authUrl.searchParams.set("access_type", "offline");
authUrl.searchParams.set("prompt", "consent");

function openBrowser(url) {
  const platform = process.platform;
  // On Windows, `cmd start` mangles URLs containing "&" (command separator).
  // rundll32 FileProtocolHandler receives the URL as a single argument.
  if (platform === "win32")
    spawn("rundll32", ["url.dll,FileProtocolHandler", url], { detached: true });
  else if (platform === "darwin") spawn("open", [url], { detached: true });
  else spawn("xdg-open", [url], { detached: true });
}

const server = http.createServer(async (req, res) => {
  if (!req.url || !req.url.startsWith("/oauth2callback")) {
    res.writeHead(404);
    res.end();
    return;
  }

  const params = new URL(req.url, REDIRECT_URI).searchParams;
  const code = params.get("code");
  const error = params.get("error");

  if (error) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`<h1>Authorization failed</h1><p>${error}</p>`);
    console.error("\n✗ Authorization error:", error, "\n");
    server.close();
    return;
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });
    const token = await tokenRes.json();

    if (!token.refresh_token) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(
        "<h1>No refresh token returned</h1><p>Remove this app's access at https://myaccount.google.com/permissions and run the script again.</p>",
      );
      console.error(
        "\n✗ No refresh_token in response:",
        JSON.stringify(token, null, 2),
        "\n  Tip: revoke prior access at https://myaccount.google.com/permissions and retry.\n",
      );
      server.close();
      return;
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      "<h1>✓ Success</h1><p>You can close this tab and return to the terminal.</p>",
    );

    console.log("\n──────────────────────────────────────────────────────────");
    console.log("✓ Add this line to your .env.local:\n");
    console.log(`GMAIL_REFRESH_TOKEN=${token.refresh_token}`);
    console.log("\n──────────────────────────────────────────────────────────\n");
  } catch (e) {
    console.error("\n✗ Token exchange failed:", e, "\n");
  } finally {
    server.close();
  }
});

server.listen(PORT, () => {
  console.log("\nOpening your browser to authorize Gmail access…");
  console.log("If it doesn't open, paste this URL manually:\n");
  console.log(authUrl.toString() + "\n");
  openBrowser(authUrl.toString());
});
