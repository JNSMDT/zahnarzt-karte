export const CATEGORY_COLORS = {
  1: "#006400",
  2: "#90ee90",
  3: "#ffff00",
  4: "#ffa500",
  5: "#ff4500",
  6: "#ff0000",
};

function getCategoryColor(category) {
  switch (category) {
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
  const cat = feature.properties.gemeindeZADaten.kategorie;

  if (cat === 5) {
    return {
      fillOpacity: 0,
    };
  }

  return {
    fillColor: getCategoryColor(cat),
  };
}

const styleFunctions = {
  zaa: () => {},
  zab: () => {},
  haus: () => {},
  cat: categoryStyles,
};

/**
 * @param {GeoJSON} layer
 */
export function addStyleFunction(layer) {
  console.log("creating button styles");

  const buttonElements = document.getElementsByClassName("styleButton");

  const buttonList = Array.from(buttonElements);
  buttonList.forEach((button) => {
    const style = button.dataset.style;
    button.onclick = () => {
      layer.setStyle(styleFunctions[style]);
      buttonList.forEach((button) => button.classList.remove("active"));
      button.classList.add("active");
    };
  });
}
