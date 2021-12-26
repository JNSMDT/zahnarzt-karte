function getCatColor(cat) {
  return cat == 0
    ? "#262626"
    : cat == 1
    ? "#006400"
    : cat == 2
    ? "#90ee90"
    : cat == 3
    ? "#ffff00"
    : cat == 4
    ? "#ffa500"
    : cat == 5
    ? "#ff4500"
    : cat == 6
    ? "#ff0000"
    : "#ffffff";
}

/**
 * @type {import("leaflet").StyleFunction}
 */
export function catStyle(feature) {
  return {
    fillColor: getCatColor(feature.properties.kategorie),
    fillOpacity: 0.9,
    color: "grey",
    weight: 2,
    opacity: 0.5,
  };
}
