/**
 * @typedef {Object} GemeindeDaten
 * @property {number} gemeindeschlüssel
 * @property {string} gemeindename
 * @property {string} kreisname
 * @property {number} bevölkerung
 * @property {number} za_absolut
 * @property {number} za_bereinigt
 * @property {number} hausbesuche
 * @property {number} versorgungsindex
 */

// export function convertPopToNum(data) {
//   const newResults = data.map((d) => {
//     const { bevölkerung } = d;
//     if (typeof bevölkerung === "number") {
//       return d;
//     }

//     const pop_no_point = bevölkerung.replace(".", "");
//     const pop_num = Number(pop_no_point);

//     return { ...d, bevölkerung: pop_num };
//   });

//   return newResults;
// }

export function injectVI(results) {
  const newResults = results.map((result) => {
    const { bevölkerung, za_absolut } = result;
    const vi = (za_absolut * 1000) / bevölkerung;
    return { ...result, versorgungsindex: vi };
  });

  return newResults;
}

export function normalizeKeys(data) {
  const normalizedResults = data.map((d) => {
    /**
     * @type {number}
     */
    let bevölkerung = d["Bevölkerung"];
    bevölkerung = Number(bevölkerung.toString().replace(".", ""));

    return {
      gemeindename: d.Gemeinde_Name,
      gemeindeschlüssel: d["Gemeindeschlüssel"],
      kreisname: d.kreis_name,
      bevölkerung: bevölkerung,
      za_absolut: d.za_absolut,
      za_bereinigt: d.za_bereinigt,
      hausbesuche: d.hausbesuche,
      kategorie: d.Kategorie === null ? 0 : d.Kategorie,
    };
  });
  return normalizedResults;
}

/**
 *
 * @param {Record<string,unknonw>} geoJSON
 * @param {GemeindeDaten[]} gemeindeDaten
 * @returns
 */
export function combineJSON(geoJSON, gemeindeDaten) {
  const { type, features } = geoJSON;

  const newFeat = features.map((feat) => {
    const gemeindeName = feat.properties.gemeinde_name;
    /**
     * @type {number}
     */
    const gemeindeSchlüssel = feat.properties.gemeinde_schluessel;
    const kreisSchlüssel = feat.properties.kreis_schluessel;

    const gsString = gemeindeSchlüssel.toString();
    const gsLastThree = gsString.slice(gsString.length - 3);

    const zaGemeindeSchlüssel = Number(`${kreisSchlüssel}${gsLastThree}`);

    const gemeindeZADaten = gemeindeDaten.find(
      (gD) =>
        gD.gemeindeschlüssel === zaGemeindeSchlüssel &&
        gD.gemeindename === gemeindeName
    );

    const newProp = { ...feat.properties, gemeindeZADaten };
    return { type: feat.type, properties: newProp, geometry: feat.geometry };
  });

  const newGeoJSon = { type, features: newFeat };
  return newGeoJSon;
}
