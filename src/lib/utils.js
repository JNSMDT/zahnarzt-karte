import localforage from "localforage";

/**
 *
 * @param {string} url
 */
export async function fetchJSON(url) {
  const res = await fetch(url);
  const json = await res.json();

  return json;
}

const STORAGE_KEY = "geoJSONMV";

/**
 *
 * @param {string} url
 */
export async function getGeoJSON(url) {
  const localGeoJSON = await localforage.getItem(STORAGE_KEY);
  const lastPush = await localforage.getItem("lastPush");

  const timestamp = new Date().getTime();
  const maxTime = 1000 * 21600; // 1000ms -> 1s, 21600s -> 6h

  if (!localGeoJSON || !lastPush || Number(lastPush) > timestamp + maxTime) {
    const geoJSON = await fetchJSON(url);
    await localforage.setItem(STORAGE_KEY, geoJSON);
    await localforage.setItem("lastPush", timestamp);

    return geoJSON;
  }

  return localGeoJSON;
}
