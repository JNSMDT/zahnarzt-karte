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
  "https://json-provider.jnsmdt.workers.dev/zaGemData";
/**
 * @type {string}
 */
const LANDKREIS_ZAHNARZT_DATA_URL =
  "https://json-provider.jnsmdt.workers.dev/zaLKData";

const STARTPOS = [53.9, 12.6]; // starting position [lng, lat]

/**
 * Hauptfunktion um asynchrone Methoden besser abzubilden bzw. ohne .then und callbacks arbeiten zu können.
 */
async function main() {
  // ## Laden der Daten ##

  // Laden der Gemeinde-Geo-Daten
  const gemeindeGeoJSON = await getJSONData(
    GEMEINDE_GEOJSON_URL,
    "gemeindeGeoJSON",
    true
  );

  // Laden der Landkreis-Geo-Daten
  const landkreisGeoJSON = await getJSONData(
    LANDKREIS_GEOJSON_URL,
    "landkreisGeoJSON",
    true
  );

  // Laden der Lankreis-Zahnarzt-Daten
  let landkreisZahnarztData = await getJSONData(
    LANDKREIS_ZAHNARZT_DATA_URL,
    "landkreisZahnarztDaten"
  );

  // Vereinheitlichen der Zahnarztdaten Keys auf die Geodaten Keys
  landkreisZahnarztData = normalizeKeys(landkreisZahnarztData, true);

  // Laden der Gemeinde-Zahnarzt-Daten
  let gemeindeZahnarztDaten = await getJSONData(
    GEMEINDE_ZAHNARZT_DATA_URL,
    "gemeindeZahnarztDaten"
  );
  
  // Vereinheitlichen der Zahnarztdaten Keys auf die Geodaten Keys
  gemeindeZahnarztDaten = normalizeKeys(gemeindeZahnarztDaten);

  // Berechnen des Versorgungsindex und einfügen in den Zahnarztdatensatz
  gemeindeZahnarztDaten = injectVI(gemeindeZahnarztDaten);

  // vereinen der GeoJSON und Zahnarstdaten (Gemeinde)
  const gemeindeZahnarztGeoJSON = combineGemeindeJSON(
    gemeindeGeoJSON,
    gemeindeZahnarztDaten
  );

  // vereinen der GeoJSON und Zahnarztdaten (Landkreis)
  const landkreisZahnarztGeoJSON = combineLandkreisJSON(
    landkreisGeoJSON,
    landkreisZahnarztData
  );

  // Selecting der Kontrollbar im DOM
  const controlBar = document.getElementById("ControlBar");

  // Wenn Kontrolbar gefunden wurde, anzeigen der Kontrolbar
  // Die Kontrolbar ist Standardmäßig ausgeblendet, da das Laden der Daten sehr lange dauert
  if (controlBar) controlBar.classList.remove("hidden");

  // Initialisieren der Karte

  // festlegen der Standardoptionen der Karte
  /**
   * @type L.MapOptions
   */
  const mapOptions = {
    zoomSnap: 0.1,
    zoomControl: false,
  };

  // Erstellen einer neuen Karteninstanz
  const map = L.map("map", mapOptions);

  // Startpunkt auf der Karte setzen
  map.setView(STARTPOS, 0);

  // Maptile erstellen und laden
  const mapTile = L.tileLayer(
    "https://tile.jawg.io/bb320d20-02b7-4285-b370-e6ffc012a219/{z}/{x}/{y}{r}.png?access-token=trdpYvK5CNGdcUtYZwYlLkK4k4oBpUisLjA51tTh7dxFzcI1u5NdtYy9JqAk8NZN",
    {}
  );
  // Maptile zur Karte hinzufügen
  mapTile.addTo(map);

  // Neuen Daten/GeoJSON Layer für die Gemeinden
  // Basisstyling setzen
  // Klickfunktion erstellen und hinzufügen
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

  // Neuer Daten/GeoJSON Layer für die Landkreise
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

  // Neue Legendeninstanz erstellen
  const legend = new Legend({
    position: "topleft",
    content: "",
  });

  // Legende zur Karte hinzufügen
  map.addControl(legend);

  // Funktion um beim umschalten zwischen Gemeinde und Landkreis die Legende anzupassen
  addStyleFunction(gemeindeLayer, landkreisLayer, legend);

  // Daten/GeoJSON Layer zur Karte hinzufügen
  map.addLayer(gemeindeLayer);
  map.addLayer(landkreisLayer);

  // Zoom auf Bereiche mit vorhandenen Daten
  map.fitBounds(gemeindeLayer.getBounds());

  // Debugging Nachrichten in der Konsole
  console.log("Welcome to this little map.");
  console.log(`You are on version ${pkg.version}`);
}

main();
