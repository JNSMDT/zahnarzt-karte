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
  const localGeoJSON = await localforage.getItem(key);
  const lastPush = await localforage.getItem(`lastPush-${key}`);

  const timestamp = new Date().getTime();
  const maxTime = 1000 * 21600; // 1000ms -> 1s, 21600s -> 6h

  if (!localGeoJSON || !lastPush || Number(lastPush) > timestamp + maxTime) {
    const geoJSON = await fetchJSON(url);
    await localforage.setItem(key, geoJSON);
    await localforage.setItem(`lastPush-${key}`, timestamp);

    return geoJSON;
  }

  return localGeoJSON;
}
