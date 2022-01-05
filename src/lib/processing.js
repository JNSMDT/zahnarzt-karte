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
    return { ...result, versorgungsindex: vi.toFixed(4) };
  });

  return newResults;
}

export function normalizeKeys(data, isLK = false) {
  if (isLK) {
    const normalizedResults = data.map((d) => {
      return {
        kreisID: d.id_Kreis,
        kreisname: d.kreis_name,
        za_absolut: d.za_absolut,
        za_bereinigt: d.za_bereinigt,
        hausbesuche: d.hausbesuche,
      };
    });
    return normalizedResults;
  }
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
export function combineGemeindeJSON(geoJSON, gemeindeDaten) {
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

    const zahnarztDaten = gemeindeDaten.find(
      (gD) =>
        gD.gemeindeschlüssel === zaGemeindeSchlüssel &&
        gD.gemeindename === gemeindeName
    );

    const newProp = { ...feat.properties, zahnarztDaten };
    return { type: feat.type, properties: newProp, geometry: feat.geometry };
  });

  const newGeoJSON = { type, features: newFeat };
  return newGeoJSON;
}

export function combineLandkreisJSON(geoJSON, landkreisDaten) {
  const { type, features } = geoJSON;

  const newFeat = features.map((feat) => {
    const kreisname = feat.properties.kreis_name;

    const zahnarztDaten = landkreisDaten.find(
      (lD) => lD.kreisname === kreisname
    );
    const newProp = { ...feat.properties, zahnarztDaten };
    return { type: feat.type, properties: newProp, geometry: feat.geometry };
  });
  const newGeoJSON = { type, features: newFeat };
  return newGeoJSON;
}
