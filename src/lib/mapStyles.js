import { getLegendHTML } from "./utils";

export const VI_BASE_COLORS = {
  dunkelgrün: "#1a9850",
  hellgrün: "#91cf60",
  gelbgrün: "#d9ef8b",
  gelb: "#fee08b",
  orange: "#fb8350",
  rot: "#e05252",
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

function getZAColors(zaa) {
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

export const RVI_COLORS = {
  Mitversorger: VI_BASE_COLORS.dunkelgrün,
  Selbstversorger: VI_BASE_COLORS.hellgrün,
  "bedarfsdeckende Gemeinde": VI_BASE_COLORS.gelbgrün,
  Versorgte: VI_BASE_COLORS.gelb,
  "Selbst-Unterversorgte": VI_BASE_COLORS.orange,
  Unterversorgte: VI_BASE_COLORS.rot,
};

function getRVIColors(category) {
  switch (category) {
    case 1:
      return RVI_COLORS["Mitversorger"];
    case 2:
      return RVI_COLORS["Selbstversorger"];
    case 3:
      return RVI_COLORS["bedarfsdeckende Gemeinde"];
    case 4:
      return RVI_COLORS["Versorgte"];
    case 5:
      return RVI_COLORS["Selbst-Unterversorgte"];
    case 6:
      return RVI_COLORS["Unterversorgte"];
    default:
      return "#fff";
  }
}

// #################################################################################################

export const VI_COLORS = {
  "1,2 (>2000)": VI_BASE_COLORS.dunkelgrün,
  "0,95": VI_BASE_COLORS.hellgrün,
  "0,75": VI_BASE_COLORS.gelb,
  "< 0,75": VI_BASE_COLORS.rot,
};

function getVIColors(vi, pop) {
  switch (true) {
    case vi > 1.2 && pop > 2000:
      return VI_COLORS["1,2 (>2000)"];
    case vi >= 0.95:
      return VI_COLORS["0,95"];
    case vi >= 0.75:
      return VI_COLORS["0,75"];
    case vi < 0.75:
      return VI_COLORS["< 0,75"];
    default:
      return "#fff";
  }
}

// #################################################################################################

export const LKZA_COLORS = {
  "< 100": "#c6dbef",
  "100 - 149": "#6baed6",
  "150 - 199": "#2171b5",
  "200 - 250": "#08519c",
  "> 250": "#08306b",
};

function getLKZAColors(za) {
  switch (true) {
    case za > 250:
      return LKZA_COLORS["> 250"];
    case za >= 200:
      return LKZA_COLORS["200 - 250"];
    case za >= 150:
      return LKZA_COLORS["150 - 199"];
    case za >= 100:
      return LKZA_COLORS["100 - 149"];
    case za < 100:
      return LKZA_COLORS["< 100"];
    default:
      return "#fff";
  }
}

// #################################################################################################

export const LKHAUS_COLORS = {
  "< 25": "#c6dbef",
  "25 - 35": "#2171b5",
  "36 - 40": "#08519c",
  "> 40": "#08306b",
};

function getLKHAUSColors(haus) {
  switch (true) {
    case haus > 40:
      return LKHAUS_COLORS["> 40"];
    case haus >= 35:
      return LKHAUS_COLORS["36 - 40"];
    case haus >= 25:
      return LKHAUS_COLORS["25 - 35"];
    case haus < 25:
      return LKHAUS_COLORS["< 25"];
    default:
      return "#fff";
  }
}

// #################################################################################################

/**
 * @type {import("leaflet").StyleFunction}
 */
export function zaaStyles(feature) {
  const zaa = feature.properties.zahnarztDaten.za_absolut;
  return {
    fillColor: getZAColors(zaa),
    fillOpacity: 0.95,
    opacity: 1,
  };
}
/**
 * @type {import("leaflet").StyleFunction}
 */
export function zabStyles(feature) {
  const zab = feature.properties.zahnarztDaten.za_bereinigt;

  return {
    fillColor: getZAColors(zab),
    fillOpacity: 0.95,
    opacity: 1,
  };
}
/**
 * @type {import("leaflet").StyleFunction}
 */
export function hausStyles(feature) {
  const haus = feature.properties.zahnarztDaten.hausbesuche;

  return {
    fillColor: getZAColors(haus),
    fillOpacity: 0.95,
    opacity: 1,
  };
}
/**
 * @type {import("leaflet").StyleFunction}
 */
export function viStyles(feature) {
  const vi = feature.properties.zahnarztDaten.versorgungsindex;
  const pop = feature.properties.zahnarztDaten.bevölkerung;

  return {
    fillColor: getVIColors(vi, pop),
    fillOpacity: 0.95,
    opacity: 1,
  };
}
/**
 * @type {import("leaflet").StyleFunction}
 */
export function rviStyles(feature) {
  const rvi = feature.properties.zahnarztDaten.kategorie;

  return {
    fillColor: getRVIColors(rvi),
    fillOpacity: 0.95,
    opacity: 1,
  };
}
/**
 * @type {import("leaflet").StyleFunction}
 */
export function lkzaaStyles(feature) {
  const { za_absolut } = feature.properties.zahnarztDaten;

  return {
    fillColor: getLKZAColors(za_absolut),
    fillOpacity: 0.95,
    opacity: 1,
  };
}
export function lkzabStyles(feature) {
  const { za_bereinigt } = feature.properties.zahnarztDaten;

  return {
    fillColor: getLKZAColors(za_bereinigt),
    fillOpacity: 0.95,
    opacity: 1,
  };
}
export function lkhausStyles(feature) {
  const { hausbesuche } = feature.properties.zahnarztDaten;

  return {
    fillColor: getLKHAUSColors(hausbesuche),
    fillOpacity: 0.95,
    opacity: 1,
  };
}

const styleFunctions = {
  zaa: zaaStyles,
  zab: zabStyles,
  haus: hausStyles,
  vi: viStyles,
  rvi: rviStyles,
  lkzaa: lkzaaStyles,
  lkzab: lkzabStyles,
  lkhaus: lkhausStyles,
};

const colorObjects = {
  zaa: ZA_COLORS,
  zab: ZA_COLORS,
  haus: ZA_COLORS,
  vi: VI_COLORS,
  rvi: RVI_COLORS,
  lkzaa: LKZA_COLORS,
  lkzab: LKZA_COLORS,
  lkhaus: LKHAUS_COLORS,
};

/**
 * @param {import("leaflet").FeatureGroup<any>} gemeindeLayer
 * @param {import("leaflet").FeatureGroup<any>} landkreisLayer
 */
export function addStyleFunction(gemeindeLayer, landkreisLayer, legend) {
  const buttonElements = document.getElementsByClassName("styleButton");

  const buttonList = Array.from(buttonElements);
  buttonList.forEach((button) => {
    const style = button.dataset.style;
    const dataID = button.dataset.id;
    button.onclick = () => {
      if (dataID === "gD") {
        landkreisLayer.bringToBack();
        landkreisLayer.setStyle({
          fillOpacity: 0,
          opacity: 0,
        });
        gemeindeLayer.setStyle(styleFunctions[style]);
      } else if (dataID === "lkD") {
        gemeindeLayer.bringToBack();
        gemeindeLayer.setStyle({
          fillOpacity: 0,
          opacity: 0,
        });
        landkreisLayer.setStyle(styleFunctions[style]);
      }

      legend.setContent(getLegendHTML(colorObjects[style], `legend-${style}`));
      buttonList.forEach((button) => button.classList.remove("active"));
      button.classList.add("active");
    };
  });
}
