export const CATEGORY_COLORS = {
  noKat: "#262626",
  1: "#006400",
  2: "#90ee90",
  3: "#ffff00",
  4: "#ffa500",
  5: "#ff4500",
  6: "#ff0000",
};

function getCategoryColor(category) {
  switch (category) {
    case 0:
      return CATEGORY_COLORS["noKat"];
    case 1:
      return CATEGORY_COLORS["1"];
    case 2:
      return CATEGORY_COLORS["2"];
    case 3:
      return CATEGORY_COLORS["3"];
    case 4:
      return CATEGORY_COLORS["4"];
    case 5:
      return CATEGORY_COLORS["5"];
    case 6:
      return CATEGORY_COLORS["6"];
    default:
      return "#fff";
  }
}

/**
 * @type {import("leaflet").StyleFunction}
 */
export function categoryStyles(feature) {
  return {
    fillColor: getCategoryColor(feature.properties.gemeindeZADaten.kategorie),
    fillOpacity: 0.9,
    color: "grey",
    weight: 2,
    opacity: 0.5,
  };
}
