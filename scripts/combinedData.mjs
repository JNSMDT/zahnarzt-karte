import geoMV from "../data/geoMV.json";
import { writeFile, readFile } from "fs/promises";
import { resolve } from "path";

const args = process.argv.slice(2);

async function main() {
  const { type, features } = geoMV;

  const zaDataFile = await readFile(resolve(args[0]));
  /**
   * @type {Record<string,unknown>[]]}
   */
  const zaData = JSON.parse(zaDataFile.toString());

  const newFeat = features.map((feat) => {
    const { type, properties, geometry } = feat;

    const gemeindeZaData = zaData.filter((za) => {
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

    const gemeindeDaten = gemeindeZaData[0];

    const newProp = { ...properties, gemeindeZADaten: gemeindeDaten };
    return { type, properties: newProp, geometry };
  });

  const newGeoJSon = { type, features: newFeat };
  await writeFile("./data/geoMVwZA.json", JSON.stringify(newGeoJSon));
}

main();
