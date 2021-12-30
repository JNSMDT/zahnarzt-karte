import { updateSidebar } from "./lib/sidebar";
import { getJSONData } from "./lib/utils";
import { combineJSON, convertPopToNum, normalizeKeys } from "./lib/processing";
import { addStyleFunction, CATEGORY_COLORS } from "./lib/controls";
/**
 * @typedef {import(@types/leaflet)}
 */

// ###################################################################
// OLD FROM MAPBOX GL

// const legendThresholds = {
//   ZaV: [
//     "0",
//     "1 - 2",
//     "3 - 5",
//     "6 - 10",
//     "11 - 20",
//     "21 - 50",
//     "51-100",
//     "> 100",
//   ],
//   LK: ["< 100", "100 - 149", "150 - 199", "200 - 250", "> 250"],
//   VI: ["< 0.75", "0.75 - 1", "> 1"],
//   RVI: ["no Kat", "1", "2", "3", "4", "5", "6"],
// };

// const BUTTON_NAME = {
//   ZaV: "Zahnarzt (absolut)",
//   ZaV_b: "Zaharzt (bereinigt)",
//   ZaV_H: "Hausbesuche",
//   VI: "Versorgungsindex",
//   RVI: "Regionaler VI",
//   gBorder: "Gemeinden",
//   lkBorder: "Landkreise",
// };

// const COLORS = {
//   ZaV: [
//     "#ffffff",
//     "#c6dbef",
//     "#9ecae1",
//     "#6baed6",
//     "#4292c6",
//     "#2171b5",
//     "#08519c",
//     "#08306b",
//   ],
//   LK: ["#c6dbef", "#6baed6", "#2171b5", "#08519c", "#08306b"],
//   VI: ["#fcbba1", "#ffffff", "#a1d99b"],
//   RVI: [
//     "#262626",
//     "#006400",
//     "#90ee90",
//     "#ffff00",
//     "#ffa500",
//     "#ff4500",
//     "#ff0000",
//   ],
// };

// ###################################################################

const GEOJSON_URL =
  "https://geo.sv.rostock.de/download/opendata/gemeinden_mecklenburg-vorpommern/gemeinden_mecklenburg-vorpommern.json";

const GEMEINDE_DATA_URL =
  "https://json-provider.angertitan.workers.dev/zaGemData";

const STARTPOS = [53.9, 12.6]; // starting position [lng, lat]
const ZOOM = 9.2;

async function main() {
  // Get Data
  console.log("Getting Data");
  const geoJSONMV = await getJSONData(GEOJSON_URL, "geoJSONMV");
  console.log({ m: "received geoJSON", d: geoJSONMV });
  let gemeindeDaten = await getJSONData(GEMEINDE_DATA_URL, "gemeindeDaten");
  console.log({ m: "received gemeindeDaten", d: gemeindeDaten });

  // Process Data
  gemeindeDaten = normalizeKeys(gemeindeDaten);
  gemeindeDaten = convertPopToNum(gemeindeDaten);

  const geoJSONGemData = combineJSON(geoJSONMV, gemeindeDaten);
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

  // Add geoJSON Layer
  const geoJSONLayer = L.geoJSON(geoJSONGemData, {
    style: {
      fillColor: "#fff",
      fillOpacity: 0.9,
      color: "grey",
      weight: 2,
      opacity: 0.5,
    },
    onEachFeature: (feature, layer) => {
      layer.on({
        click: () => {
          console.log(feature.properties.gemeindeZADaten);
          updateSidebar(feature.properties.gemeindeZADaten);
        },
      });
    },
  });

  addStyleFunction(geoJSONLayer);
  map.addLayer(geoJSONLayer);

  //

  // add Legend
  const legend = L.control({ position: "topright" });
  legend.onAdd = function (map) {
    const legendElement = L.DomUtil.create("div", "legend");
    const categories = Object.keys(CATEGORY_COLORS);

    categories.forEach((cat) => {
      const legendItem = L.DomUtil.create("div", "legend-item", legendElement);
      const legendItemColor = L.DomUtil.create(
        "div",
        "legend-color",
        legendItem
      );
      const legendItemValue = L.DomUtil.create(
        "div",
        "legend-value",
        legendItem
      );

      legendItemColor.style.backgroundColor = `${CATEGORY_COLORS[cat]}`;
      legendItemValue.innerText = `${cat}`;
    });

    return legendElement;
  };
  legend.addTo(map);
}

main();
