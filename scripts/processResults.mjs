import rawResults from "../data/rawResults.json";
import { writeFile } from "fs/promises";
/**
 * @typedef {Object} RawResults
 * @property {number} Gemeindeschlüssel
 * @property {string} kreis_name
 * @property {string} Gemeindename
 * @property {string} Gemeinde_Name
 * @property {string} Bevölkerung
 * @property {number} za_absolut
 * @property {number} za_bereinigt
 * @property {number} hausbesuche
 * @property {number} Kategorie
 */
/**
 * @typedef {Object} NormalizedResults
 * @property {number} gemeindeschlüssel
 * @property {string} gemeindename
 * @property {string} kreisname
 * @property {string} bevölkerung
 * @property {number} za_absolut
 * @property {number} za_bereinigt
 * @property {number} hausbesuche
 * @property {number} kategorie
 */

/**
 * @typedef {Object} ResultPopNum
 * @property {number} gemeindeschlüssel
 * @property {string} gemeindename
 * @property {string} kreisname
 * @property {number} bevölkerung
 * @property {number} za_absolut
 * @property {number} za_bereinigt
 * @property {number} hausbesuche
 * @property {number} kategorie
 */
/**
 * @typedef {Object} ResultWithVI
 * @property {number} gemeindeschlüssel
 * @property {string} gemeindename
 * @property {string} kreisname
 * @property {number} bevölkerung
 * @property {number} za_absolut
 * @property {number} za_bereinigt
 * @property {number} hausbesuche
 * @property {number} versorgungsindex
 */

/**
 *
 * @param {NormalizedResults[]} results
 * @returns {ResultPopNum[]}
 */

const args = process.argv.slice(2);

/**
 *
 * @param {string[]} searchArgs
 */
function inArgs(...searchArgs) {
  if (searchArgs.length === 1 && typeof searchArgs[0] === "string") {
    return args.includes(searchArgs);
  }

  const allInArgs = searchArgs.some((arg) => args.includes(arg));

  return allInArgs;
}

function convertPopToNum(results) {
  const newResults = results.map((result) => {
    const { bevölkerung } = result;

    const pop_no_point = bevölkerung.replace(".", "");
    const pop_num = Number(pop_no_point);

    return { ...result, bevölkerung: pop_num };
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
 * @param {RawResults[]} results
 * @returns {NormalizedResults}
 */
function normalizeKeys(results) {
  const normalizedResults = results.map((result) => {
    const {
      Bevölkerung,
      Gemeinde_Name,
      Gemeindename,
      Gemeindeschlüssel,
      hausbesuche,
      kreis_name,
      za_absolut,
      za_bereinigt,
      Kategorie,
    } = result;

    return {
      gemeindename: Gemeinde_Name,
      gemeindeschlüssel: Gemeindeschlüssel,
      kreisname: kreis_name,
      bevölkerung: Bevölkerung,
      za_absolut: za_absolut,
      za_bereinigt: za_bereinigt,
      hausbesuche: hausbesuche,
      kategorie: Kategorie,
    };
  });
  return normalizedResults;
}

function saveToFile(results) {
  writeFile("./data/processedData.json", JSON.stringify(results, null, 2));
}

async function main() {
  let processedResult = rawResults;

  console.log("normalize Results");
  processedResult = normalizeKeys(rawResults);
  processedResult = convertPopToNum(processedResult);

  if (!inArgs("--normalize-only", "-no")) {
    processedResult = injectVI(processedResult);
  }

  if (inArgs("--save", "-s")) {
    console.log("saving Results");
    await saveToFile(processedResult);
    return;
  }
}

main();
