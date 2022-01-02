import { getLegendHTML } from "./utils";

export const BASIC_COLORS = {
  dunkelgrün: "#006400",
  hellgrün: "#00c500",
  gelb: "#ffff00",
  rot: "#990000",
};

// #################################################################################################

export const ZA_COLORS = {
  0: "#ffffff",
  "1-2": "#c6dbef",
  "3-5": "#9ecae1",
  "6-10": "#6baed6",
  "11-20": "#4292c6",
  "21-50": "#2171b5",
  "51-100": "#08519c",
  ">100": "#08306b",
};

function getZAColor(zaa) {
  switch (true) {
    case zaa > 100:
      return ZA_COLORS[">100"];
    case zaa > 50:
      return ZA_COLORS["51-100"];
    case zaa > 20:
      return ZA_COLORS["21-50"];
    case zaa > 10:
      return ZA_COLORS["11-20"];
    case zaa > 5:
      return ZA_COLORS["6-10"];
    case zaa > 2:
      return ZA_COLORS["3-5"];
    case zaa > 0:
      return ZA_COLORS["1-2"];
    case zaa === 0:
      return ZA_COLORS["0"];
    default:
      return "#fff";
  }
}

// #################################################################################################

export const HAUS_COLORS = {
  1: "#006400",
  2: "#90ee90",
  3: "#ffff00",
  4: "#ffa500",
  5: "#ff4500",
  6: "#ff0000",
};

function getHausColor(haus) {
  switch (haus) {
    case 1:
      return HAUS_COLORS["1"];
    case 2:
      return HAUS_COLORS["2"];
    case 3:
      return HAUS_COLORS["3"];
    case 4:
      return HAUS_COLORS["4"];
    case 5:
      return HAUS_COLORS["5"];
    case 6:
      return HAUS_COLORS["6"];
    default:
      return "#fff";
  }
}

// #################################################################################################

export const CATEGORY_COLORS = {
  1: BASIC_COLORS["dunkelgrün"],
  2: BASIC_COLORS["hellgrün"],
  3: BASIC_COLORS["gelb"],
  4: "#ffae1a",
  5: "#ff4500",
  6: BASIC_COLORS["rot"],
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

// #################################################################################################

export const VI_COLORS = {
  1: "#006400",
  2: "#90ee90",
  3: "#ffff00",
  4: "#ffa500",
  5: "#ff4500",
  6: "#ff0000",
};

function getVIColor(vi) {
  switch (vi) {
    case 1:
      return VI_COLORS["1"];
    case 2:
      return VI_COLORS["2"];
    case 3:
      return VI_COLORS["3"];
    case 4:
      return VI_COLORS["4"];
    case 5:
      return VI_COLORS["5"];
    case 6:
      return VI_COLORS["6"];
    default:
      return "#fff";
  }
}

// #################################################################################################

/**
 * @type {import("leaflet").StyleFunction}
 */
export function zaaStyles(feature) {
  const zaa = feature.properties.gemeindeZADaten.za_absolut;
  return {
    fillColor: getZAColor(zaa),
  };
}
/**
 * @type {import("leaflet").StyleFunction}
 */
export function zabStyles(feature) {
  const zab = feature.properties.gemeindeZADaten.za_bereinigt;

  return {
    fillColor: getZAColor(zab),
  };
}
/**
 * @type {import("leaflet").StyleFunction}
 */
export function hausStyles(feature) {
  const haus = feature.properties.gemeindeZADaten.hausbesuche;

  return {
    fillColor: getZAColor(haus),
  };
}
/**
 * @type {import("leaflet").StyleFunction}
 */
export function viStyles(feature) {
  const vi = feature.properties.gemeindeZADaten.vi;

  return {
    fillColor: getVIColor(vi),
  };
}
/**
 * @type {import("leaflet").StyleFunction}
 */
export function categoryStyles(feature) {
  const cat = feature.properties.gemeindeZADaten.kategorie;

  return {
    fillColor: getCategoryColor(cat),
  };
}

const styleFunctions = {
  zaa: zaaStyles,
  zab: zabStyles,
  haus: hausStyles,
  vi: viStyles,
  cat: categoryStyles,
};

const colorObjects = {
  zaa: ZA_COLORS,
  zab: ZA_COLORS,
  haus: ZA_COLORS,
  vi: VI_COLORS,
  cat: CATEGORY_COLORS,
};

/**
 * @param {GeoJSON} layer
 */
export function addStyleFunction(layer, legend) {
  console.log("creating button styles");

  const buttonElements = document.getElementsByClassName("styleButton");

  const buttonList = Array.from(buttonElements);
  buttonList.forEach((button) => {
    const style = button.dataset.style;
    button.onclick = () => {
      layer.setStyle(styleFunctions[style]);
      legend.setContent(getLegendHTML(colorObjects[style]));
      buttonList.forEach((button) => button.classList.remove("active"));
      button.classList.add("active");
    };
  });
}
