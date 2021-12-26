import geoMV from "../data/geoMV.json";
import { writeFile, readFile } from "fs/promises";
import { resolve } from "path";

const args = process.argv.slice(2);

async function main() {
  const { type, features } = geoMV;

  const zaDataFile = await readFile(resolve(args[0]));
  const zaData = JSON.parse(zaDataFile.toString());

  const newFeat = features.map((feat) => {
    const { type, properties, geometry } = feat;

    const gemeindeZaData = zaData.filter(
      (za) =>
        za.gemeindename == properties.gemeinde_name &&
        za.kreisname == properties.kreis_name
    );

    let gemeindeDaten = gemeindeZaData[0];

    if (gemeindeZaData.length === 0) {
      gemeindeDaten = {
        versorgungsindex: 0,
        za_absolut: 0,
        za_bereinigt: 0,
        hausbesuche: 0,
        kategorie: 0,
      };
    }
    const newProp = { ...properties, ...gemeindeDaten };
    return { type, properties: newProp, geometry };
  });

  const newGeoJSon = { type, features: newFeat };
  await writeFile("./data/geoMVwZA.json", JSON.stringify(newGeoJSon));
}

main();
