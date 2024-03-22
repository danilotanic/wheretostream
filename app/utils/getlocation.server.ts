export async function getLocation(headers: Headers) {
  let location = headers.get("CF-IPCountry");

  // https://developers.cloudflare.com/fundamentals/reference/http-request-headers/#cf-ipcountry
  if (location === "XX" || location === "T1") {
    location = null;
  }

  return location;
}
