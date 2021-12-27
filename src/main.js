import localGEOJSON from "../data/geoMVwZA.json";
import { catStyle } from "./lib/layerStyles";
// import stateBorders from "../data/lkmv.json";
import { getGeoJSON } from "./lib/utils";
/**
 * @typedef {import(@types/leaflet)}
 */

// ###################################################################
// OLD FROM MAPBOX GL

const legendThresholds = {
  ZaV: [
    "0",
    "1 - 2",
    "3 - 5",
    "6 - 10",
    "11 - 20",
    "21 - 50",
    "51-100",
    "> 100",
  ],
  LK: ["< 100", "100 - 149", "150 - 199", "200 - 250", "> 250"],
  VI: ["< 0.75", "0.75 - 1", "> 1"],
  RVI: ["no Kat", "1", "2", "3", "4", "5", "6"],
};

const BUTTON_NAME = {
  ZaV: "Zahnarzt (absolut)",
  ZaV_b: "Zaharzt (bereinigt)",
  ZaV_H: "Hausbesuche",
  VI: "Versorgungsindex",
  RVI: "Regionaler VI",
  gBorder: "Gemeinden",
  lkBorder: "Landkreise",
};

const COLORS = {
  ZaV: [
    "#ffffff",
    "#c6dbef",
    "#9ecae1",
    "#6baed6",
    "#4292c6",
    "#2171b5",
    "#08519c",
    "#08306b",
  ],
  LK: ["#c6dbef", "#6baed6", "#2171b5", "#08519c", "#08306b"],
  VI: ["#fcbba1", "#ffffff", "#a1d99b"],
  RVI: [
    "#262626",
    "#006400",
    "#90ee90",
    "#ffff00",
    "#ffa500",
    "#ff4500",
    "#ff0000",
  ],
};

// ###################################################################

const GEOJSON_URL =
  "https://geo.sv.rostock.de/download/opendata/gemeinden_mecklenburg-vorpommern/gemeinden_mecklenburg-vorpommern.json";

const STARTPOS = [53.9, 12.6]; // starting position [lng, lat]
const ZOOM = 9.2;

async function main() {
  // Get Data
  const geoJSONMV = await getGeoJSON(GEOJSON_URL);
  console.log(typeof geoJSONMV);
  // Init Map
  /**
   * @type L.MapOptions
   */
  const mapOptions = {
    zoomSnap: 0.1,
    zoomControl: false,
  };

  const map = L.map("map", mapOptions);

  // set View
  map.setView(STARTPOS, ZOOM);

  // set map style
  const mapTile = L.tileLayer(
    "https://tile.jawg.io/bb320d20-02b7-4285-b370-e6ffc012a219/{z}/{x}/{y}{r}.png?access-token=trdpYvK5CNGdcUtYZwYlLkK4k4oBpUisLjA51tTh7dxFzcI1u5NdtYy9JqAk8NZN",
    {}
  );
  mapTile.addTo(map);

  // kategorie
  L.geoJSON(localGEOJSON, {
    style: catStyle,
    onEachFeature: (feat, layer) => {
      layer.on({
        click: () => console.log(feat.properties),
      });
    },
  }).addTo(map);
}

main();
