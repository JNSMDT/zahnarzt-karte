import localforage from "localforage";

/**
 *
 * @param {string} url
 */
async function fetchJSON(url) {
  const res = await fetch(url);
  const json = await res.json();

  return json;
}

/**
 *
 * @param {string} url
 */
export async function getJSONData(url, key) {
  const localDataVersion = await localforage.getItem("dataVersion");

  const dataVersion = await fetchJSON(
    "https://json-provider.angertitan.workers.dev/version"
  );

  const recentDateVersion = localDataVersion === dataVersion;
  console.log({
    localDataVersion,
    dataVersion,
  });

  const localGeoJSON = recentDateVersion ? await localforage.getItem(key) : "";
  const lastPush = recentDateVersion
    ? await localforage.getItem(`lastPush-${key}`)
    : "";

  const timestamp = new Date().getTime();
  const maxTime = 1000 * 21600; // 1000ms -> 1s, 21600s -> 6h

  if (
    localGeoJSON === "" ||
    lastPush === "" ||
    Number(lastPush) > timestamp + maxTime
  ) {
    const geoJSON = await fetchJSON(url);
    await localforage.setItem(key, geoJSON);
    await localforage.setItem(`lastPush-${key}`, timestamp);
    await localforage.setItem(`dataVersion`, dataVersion);

    return geoJSON;
  }

  return localGeoJSON;
}
