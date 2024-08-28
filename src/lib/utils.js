// Localstorage kann nur 5mb daten per Key/Value Pair speichern.
// GeoJSON sind größer als 5mb. Localforage erstellt ein KV-Storge mit hilfe der IndexDB
import localforage from 'localforage';

/**
 * Laden der Daten mit fetch
 * @param {string} url
 */
async function fetchJSON(url) {
	const res = await fetch(url);
	const json = await res.json();

	return json;
}

/**
 * Laden der JSON Daten und speichern in Localstorage(IndexDB)
 * @param {string} url
 */
export async function getJSONData(url, key, longTimeData = false) {
	// laden der lokalen Datenversion
	const localDataVersion = await localforage.getItem(`dataVersion-${key}`);
	console.log("local data version:", localDataVersion.dataVersion);
	// laden der externen Datenversion
	const dataVersionReq = longTimeData ? -1 : await fetchJSON('https://json-provider.jnsmdt.workers.dev/version');

	console.log("external data version:", dataVersionReq.dataVersion);

	// prüfen auf Aktualität der Daten
	const isNewDataVersion = localDataVersion.dataVersion !== dataVersionReq.dataVersion;
	console.log(isNewDataVersion ? "new Data avaiable fetching..." : "no new data available");
	// wenn keine neuen Daten verfügbar, laden der Daten aus dem Localstorage(IndexDB)
	const localData = isNewDataVersion ? await localforage.getItem(key) : null;

	// setzen wann die Daten das letzte mal im Localstorage gespeichert wurden
	const lastPush = isNewDataVersion ? await localforage.getItem(`lastPush-${key}`) : null;

	const timestamp = new Date().getTime();
	const maxTime = 1000 * 21600; // 1000ms -> 1s, 21600s -> 6h

	// Laden der Daten aus dem Web wenn keine Datenvorhanden sind,
	// keine Daten zum letzten speichern vorhanden sind
	// oder wenn das letzte speichern mehr als 6h her ist
	if (localData === null || lastPush === null || Number(lastPush) + maxTime < timestamp) {
		const newData = await fetchJSON(url);
		await localforage.setItem(key, newData);
		await localforage.setItem(`lastPush-${key}`, timestamp);
		await localforage.setItem(`dataVersion-${key}`, dataVersionReq.dataVersion);

		return newData;
	}

	return localData;
}

// setzen der Legendstyles und HTML Struktur
export function getLegendHTML(colorObject, styleClass) {
	const legendElement = L.DomUtil.create('div', `legend-list ${styleClass}`);
	const keys = Object.keys(colorObject);

	keys.forEach((key) => {
		const legendItem = L.DomUtil.create('div', 'legend-item', legendElement);
		const legendItemColor = L.DomUtil.create('div', 'legend-color', legendItem);
		const legendItemValue = L.DomUtil.create('div', 'legend-value', legendItem);
		legendItemColor.style.backgroundColor = `${colorObject[key]}`;
		legendItemValue.innerText = `${key}`;
	});

	return legendElement.outerHTML;
}

/**
 * @typedef {Object} AllProps
 * @property {...import("./processing").GemeindeDaten}
 * @property {[key:string]: any}
 */

/**
 *
 * @param {AllProps} props
 * @param {boolean} isLK
 * @returns
 */
export function filterProps(props, isLK) {
	const { bevölkerung, gemeindename, hausbesuche, kreisname, versorgungsindex_a, versorgungsindex_b, za_absolut, za_bereinigt } = props;

	if (isLK) {
		return {
			Kreisname: kreisname,
			Hausbesuche: hausbesuche,
			'Zahnärzte (absolut)': za_absolut,
			'Zahnärzte (bereiningt)': za_bereinigt,
		};
	}

	return {
		Gemeindename: gemeindename,
		Kreisname: kreisname,
		Bevölkerung: bevölkerung,
		'Zahnärzte (absolut)': za_absolut,
		'Zahnärzte (bereiningt)': za_bereinigt,
		Hausbesuche: hausbesuche,
		'Versorgungsindex (absolut)': versorgungsindex_a,
		'Versorgungsindex (bereinigt)': versorgungsindex_b,
	};
}
