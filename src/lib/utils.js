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
export async function getJSONData(url, key, longTimeData = false) {
  const localDataVersion = await localforage.getItem(`dataVersion-${key}`);

  const dataVersion = longTimeData
    ? -1
    : await fetchJSON("https://json-provider.angertitan.workers.dev/version");

  const recentDateVersion = localDataVersion === dataVersion;
  console.log({
    localDataVersion,
    dataVersion,
  });
  const localGeoJSON = recentDateVersion
    ? await localforage.getItem(key)
    : null;
  const lastPush = recentDateVersion
    ? await localforage.getItem(`lastPush-${key}`)
    : null;

  const timestamp = new Date().getTime();
  const maxTime = 1000 * 21600; // 1000ms -> 1s, 21600s -> 6h

  if (
    localGeoJSON === null ||
    lastPush === null ||
    Number(lastPush) > timestamp + maxTime
  ) {
    const geoJSON = await fetchJSON(url);
    await localforage.setItem(key, geoJSON);
    await localforage.setItem(`lastPush-${key}`, timestamp);
    await localforage.setItem(`dataVersion-${key}`, dataVersion);

    return geoJSON;
  }

  return localGeoJSON;
}

export function getLegendHTML(colorObject) {
  const legendElement = L.DomUtil.create("div", "legend-list");
  const keys = Object.keys(colorObject);

  keys.forEach((key) => {
    const legendItem = L.DomUtil.create("div", "legend-item", legendElement);
    const legendItemColor = L.DomUtil.create("div", "legend-color", legendItem);
    const legendItemValue = L.DomUtil.create("div", "legend-value", legendItem);
    legendItemColor.style.backgroundColor = `${colorObject[key]}`;
    legendItemValue.innerText = `${key}`;
  });

  return legendElement.outerHTML;
}
