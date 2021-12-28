export function convertPopToNum(data) {
  const newResults = data.map((d) => {
    const { bevölkerung } = d;

    const pop_no_point = bevölkerung.replace(".", "");
    const pop_num = Number(pop_no_point);

    return { ...d, bevölkerung: pop_num };
  });

  return newResults;
}

/**
 *
 * @param {ResultPopNum[]} results
 * @returns {ResultWithVI}
 */
function injectVI(results) {
  const newResults = results.map((result) => {
    const { bevölkerung, za_absolut } = result;
    const vi = (za_absolut * 1000) / bevölkerung;

    return { ...result, versorgungsindex: vi };
  });

  return newResults;
}

/**
 *
 * @param {RawResults[]} data
 * @returns {NormalizedResults}
 */
export function normalizeKeys(data) {
  const normalizedResults = data.map((d) => {
    const amtname = d.Amt_Name.replace(" (amtsfreie Gemeinde)", "");

    return {
      gemeindename: d.Gemeinde_Name,
      gemeindeschlüssel: d["Gemeindeschlüssel"],
      amtname: d.amtname,
      kreisname: d.kreis_name,
      bevölkerung: d["Bevölkerung"],
      za_absolut: d.za_absolut,
      za_bereinigt: d.za_bereinigt,
      hausbesuche: d.hausbesuche,
      kategorie: d.Kategorie === null ? 0 : d.Kategorie,
    };
  });
  return normalizedResults;
}

export function combineJSON(geoJSON, gemeindeDaten) {
  const { type, features } = geoJSON;

  const newFeat = features.map((feat) => {
    const { type, properties, geometry } = feat;

    const dataToInject = gemeindeDaten.filter((za) => {
      /**
       * @type {string}
       */
      const gsString = za.gemeindeschlüssel.toString();
      const gsLastThree = gsString.slice(gsString.length - 3);

      const ks = properties.kreis_schluessel;

      const zaGemeindeSchlüssel = Number(`${ks}${gsLastThree}`);

      return (
        za.gemeindeschlüssel === zaGemeindeSchlüssel &&
        za.gemeindename == properties.gemeinde_name &&
        za.kreisname == properties.kreis_name
      );
    });

    const newProp = { ...properties, gemeindeZADaten: dataToInject[0] };
    return { type, properties: newProp, geometry };
  });

  const newGeoJSon = { type, features: newFeat };
  return newGeoJSon;
}
