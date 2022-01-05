/**
 * @typedef {import(@types/leaflet)}
 */
import { updateSidebar } from "./lib/sidebar";
import { getJSONData, getLegendHTML } from "./lib/utils";
import {
  combineGemeindeJSON,
  normalizeKeys,
  injectVI,
  combineLandkreisJSON,
} from "./lib/processing";
import { addStyleFunction } from "./lib/mapStyles";
import { Legend } from "./lib/components";
import pkg from "../package.json";

/**
 * @type {string}
 */
const GEMEINDE_GEOJSON_URL =
  "https://geo.sv.rostock.de/download/opendata/gemeinden_mecklenburg-vorpommern/gemeinden_mecklenburg-vorpommern.json";

/**
 * @type {string}
 */
const LANDKREIS_GEOJSON_URL =
  "https://geo.sv.rostock.de/download/opendata/kreise_mecklenburg-vorpommern/kreise_mecklenburg-vorpommern.json";
/**
 * @type {string}
 */
const GEMEINDE_ZAHNARZT_DATA_URL =
  "https://json-provider.angertitan.workers.dev/zaGemData";
/**
 * @type {string}
 */
const LANDKREIS_ZAHNARZT_DATA_URL =
  "https://json-provider.angertitan.workers.dev/zaLKData";

const STARTPOS = [53.9, 12.6]; // starting position [lng, lat]

async function main() {
  // Get Data
  console.log("Getting Data");
  const gemeindeGeoJSON = await getJSONData(
    GEMEINDE_GEOJSON_URL,
    "gemeindeGeoJSON",
    true
  );

  const landkreisGeoJSON = await getJSONData(
    LANDKREIS_GEOJSON_URL,
    "landkreisGeoJSON",
    true
  );

  let landkreisZahnarztData = await getJSONData(
    LANDKREIS_ZAHNARZT_DATA_URL,
    "landkreisZahnarztDaten"
  );

  landkreisZahnarztData = normalizeKeys(landkreisZahnarztData, true);

  let gemeindeZahnarztDaten = await getJSONData(
    GEMEINDE_ZAHNARZT_DATA_URL,
    "gemeindeZahnarztDaten"
  );
  // Process Data
  gemeindeZahnarztDaten = normalizeKeys(gemeindeZahnarztDaten);
  gemeindeZahnarztDaten = injectVI(gemeindeZahnarztDaten);
  const gemeindeZahnarztGeoJSON = combineGemeindeJSON(
    gemeindeGeoJSON,
    gemeindeZahnarztDaten
  );

  const landkreisZahnarztGeoJSON = combineLandkreisJSON(
    landkreisGeoJSON,
    landkreisZahnarztData
  );

  console.log(landkreisZahnarztGeoJSON);
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
  const gemeindeLayer = L.geoJSON(gemeindeZahnarztGeoJSON, {
    style: {
      fillColor: "#fff",
      fillOpacity: 0,
      color: "#444444",
      weight: 2,
      opacity: 0.1,
    },
    onEachFeature: (feature, layer) => {
      layer.on({
        click: () => {
          const { zahnarztDaten, ...geoJSONData } = feature.properties;
          console.dir({
            gdata: zahnarztDaten,
            geoData: geoJSONData,
          });
          updateSidebar(zahnarztDaten);
        },
      });
    },
  });

  const landkreisLayer = L.geoJSON(landkreisZahnarztGeoJSON, {
    style: {
      fillOpacity: 0,
      color: "#444444",
      weight: 2,
      opacity: 0,
    },
    onEachFeature: (feature, layer) => {
      layer.on({
        click: () => {
          const { zahnarztDaten, ...geoJSONData } = feature.properties;
          console.dir({
            lkdata: zahnarztDaten,
            geoData: geoJSONData,
          });
          updateSidebar(zahnarztDaten);
        },
      });
    },
  });
  const legend = new Legend({
    position: "topright",
    content: "",
  });

  map.addControl(legend);

  addStyleFunction(gemeindeLayer, landkreisLayer, legend);
  map.addLayer(gemeindeLayer);
  map.addLayer(landkreisLayer);
  // set boundaries
  map.fitBounds(gemeindeLayer.getBounds());
}

main();
