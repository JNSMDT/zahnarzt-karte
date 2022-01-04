import { updateSidebar } from "./lib/sidebar";
import { getJSONData, getLegendHTML } from "./lib/utils";
import { combineJSON, normalizeKeys, injectVI } from "./lib/processing";
import { addStyleFunction } from "./lib/mapStyles";
import { Legend } from "./lib/components";
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

async function main() {
  // Get Data
  console.log("Getting Data");
  const geoJSONMV = await getJSONData(GEOJSON_URL, "geoJSONMV", true);
  console.log({ m: "received geoJSON", d: geoJSONMV });
  let gemeindeDaten = await getJSONData(GEMEINDE_DATA_URL, "gemeindeDaten");
  console.log({ m: "received gemeindeDaten", d: gemeindeDaten });

  // Process Data
  gemeindeDaten = normalizeKeys(gemeindeDaten);
  gemeindeDaten = injectVI(gemeindeDaten);
  console.log("counter");
  // gemeindeDaten = convertPopToNum(gemeindeDaten);
  const geoJSONGemData = combineJSON(geoJSONMV, gemeindeDaten);

  // show hidden elements
  const controlBar = document.getElementById("ControlBar");
  if (controlBar) controlBar.classList.remove("hidden");

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
  map.setView(STARTPOS, 0);

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
      color: "#444444",
      weight: 2,
      opacity: 0.5,
    },
    onEachFeature: (feature, layer) => {
      layer.on({
        click: () => {
          const { gemeindeZADaten, ...geoJSONData } = feature.properties;
          console.dir({
            gdata: gemeindeZADaten,
            geoData: geoJSONData,
          });
          updateSidebar(gemeindeZADaten);
        },
      });
    },
  });
  const legend = new Legend({
    position: "topright",
    content: "",
  });

  map.addControl(legend);

  addStyleFunction(geoJSONLayer, legend);
  map.addLayer(geoJSONLayer);

  // set boundaries
  map.fitBounds(geoJSONLayer.getBounds());
}

main();
