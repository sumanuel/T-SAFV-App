import { getToken, deleteToken } from "./authStore";

let _interval = null;

function decodeJwt(token) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(payload)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

function atob(str) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "base64").toString("binary");
  }
  return global.atob ? global.atob(str) : "";
}

export function startTokenMonitor(onExpire, intervalMs = 15000) {
  stopTokenMonitor();
  _interval = setInterval(async () => {
    const token = await getToken();
    if (!token) return;
    const jwt = decodeJwt(token);
    if (!jwt || !jwt.exp) return;
    const now = Math.floor(Date.now() / 1000);
    if (jwt.exp <= now) {
      await deleteToken();
      try {
        onExpire && onExpire();
      } catch (e) {}
    }
  }, intervalMs);
}

export function stopTokenMonitor() {
  if (_interval) {
    clearInterval(_interval);
    _interval = null;
  }
}
