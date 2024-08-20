import { getLegendHTML } from './utils';

// Initialisieren von Standardwerten und Farben
// Farben Basis Versorgungsindex
export const VI_BASE_COLORS = {
	dunkelgrün: '#1a9850',
	hellgrün: '#91cf60',
	gelbgrün: '#d9ef8b',
	gelb: '#fee08b',
	orange: '#fb8350',
	rot: '#e05252',
};

// #################################################################################################

// Farben Zahnarztdaten
export const ZA_COLORS = {
	0: '#ffffff',
	'1-2': '#c6dbef',
	'3-5': '#9ecae1',
	'6-10': '#6baed6',
	'11-20': '#4292c6',
	'21-50': '#2171b5',
	'51-100': '#08519c',
	'>100': '#08306b',
};

function getZAColors(zaa) {
	switch (true) {
		case zaa > 100:
			return ZA_COLORS['>100'];
		case zaa > 50:
			return ZA_COLORS['51-100'];
		case zaa > 20:
			return ZA_COLORS['21-50'];
		case zaa > 10:
			return ZA_COLORS['11-20'];
		case zaa > 5:
			return ZA_COLORS['6-10'];
		case zaa > 2:
			return ZA_COLORS['3-5'];
		case zaa > 0:
			return ZA_COLORS['1-2'];
		case zaa === 0:
			return ZA_COLORS['0'];
		default:
			return '#fff';
	}
}

// #################################################################################################

// Farben Regionaler Versorgungsindex
export const RVI_COLORS = {
	Mitversorger: VI_BASE_COLORS.dunkelgrün,
	Selbstversorger: VI_BASE_COLORS.hellgrün,
	'bedarfsdeckende Gemeinde': VI_BASE_COLORS.gelbgrün,
	Versorgte: VI_BASE_COLORS.gelb,
	'Selbst-Unterversorgte': VI_BASE_COLORS.orange,
	Unterversorgte: VI_BASE_COLORS.rot,
};

function getRVIColors(category) {
	switch (category) {
		case 1:
			return RVI_COLORS['Mitversorger'];
		case 2:
			return RVI_COLORS['Selbstversorger'];
		case 3:
			return RVI_COLORS['bedarfsdeckende Gemeinde'];
		case 4:
			return RVI_COLORS['Versorgte'];
		case 5:
			return RVI_COLORS['Selbst-Unterversorgte'];
		case 6:
			return RVI_COLORS['Unterversorgte'];
		default:
			return '#fff';
	}
}

// #################################################################################################

// Farben Versorgungsindex
export const VI_COLORS = {
	'1,2 (>2000)': VI_BASE_COLORS.dunkelgrün,
	'0,95': VI_BASE_COLORS.hellgrün,
	'0,75': VI_BASE_COLORS.gelb,
	'< 0,75': VI_BASE_COLORS.rot,
};

function getVIColors(vi, pop) {
	switch (true) {
		case vi > 1.2 && pop > 2000:
			return VI_COLORS['1,2 (>2000)'];
		case vi >= 0.95:
			return VI_COLORS['0,95'];
		case vi >= 0.75:
			return VI_COLORS['0,75'];
		case vi < 0.75:
			return VI_COLORS['< 0,75'];
		default:
			return '#fff';
	}
}

// #################################################################################################

// Farben Landkreiszahnarztdaten
export const LKZA_COLORS = {
	'< 100': '#c6dbef',
	'100 - 149': '#6baed6',
	'150 - 199': '#2171b5',
	'200 - 250': '#08519c',
	'> 250': '#08306b',
};

function getLKZAColors(za) {
	switch (true) {
		case za > 250:
			return LKZA_COLORS['> 250'];
		case za >= 200:
			return LKZA_COLORS['200 - 250'];
		case za >= 150:
			return LKZA_COLORS['150 - 199'];
		case za >= 100:
			return LKZA_COLORS['100 - 149'];
		case za < 100:
			return LKZA_COLORS['< 100'];
		default:
			return '#fff';
	}
}

// #################################################################################################

// Farben Landkreis Hausbesuche
export const LKHAUS_COLORS = {
	'< 25': '#c6dbef',
	'25 - 35': '#2171b5',
	'36 - 40': '#08519c',
	'> 40': '#08306b',
};

function getLKHAUSColors(haus) {
	switch (true) {
		case haus > 40:
			return LKHAUS_COLORS['> 40'];
		case haus >= 35:
			return LKHAUS_COLORS['36 - 40'];
		case haus >= 25:
			return LKHAUS_COLORS['25 - 35'];
		case haus < 25:
			return LKHAUS_COLORS['< 25'];
		default:
			return '#fff';
	}
}

// #################################################################################################

// Erstellen der Leaflet Stylefunktionen

// Stylefunktionen Zahnarzt Absolut
/**
 * @type {import("leaflet").StyleFunction}
 */
export function zaaStyles(feature) {
	const zaa = feature.properties.za_absolut;
	return {
		fillColor: getZAColors(zaa),
		fillOpacity: 0.95,
		opacity: 1,
	};
}

// Stylefunktionen Zahnarzt Bereinigt
/**
 * @type {import("leaflet").StyleFunction}
 */
export function zabStyles(feature) {
	const zab = feature.properties.za_bereinigt;

	return {
		fillColor: getZAColors(zab),
		fillOpacity: 0.95,
		opacity: 1,
	};
}

// Stylefunktionen Zahnarzt Hausbesuche
/**
 * @type {import("leaflet").StyleFunction}
 */
export function hausStyles(feature) {
	const haus = feature.properties.hausbesuche;

	return {
		fillColor: getZAColors(haus),
		fillOpacity: 0.95,
		opacity: 1,
	};
}

// Stylefunktionen Zahnarzt Versorgungsindex
/**
 * @type {import("leaflet").StyleFunction}
 */
export function vi_aStyles(feature) {
	const vi_a = feature.properties.versorgungsindex_a;
	const pop = feature.properties.bevölkerung;

	return {
		fillColor: getVIColors(vi_a, pop),
		fillOpacity: 0.95,
		opacity: 1,
	};
}

// Stylefunktionen Zahnarzt Versorgungsindex
/**
 * @type {import("leaflet").StyleFunction}
 */
export function vi_bStyles(feature) {
	const vi_b = feature.properties.versorgungsindex_b;
	const pop = feature.properties.bevölkerung;

	return {
		fillColor: getVIColors(vi_b, pop),
		fillOpacity: 0.95,
		opacity: 1,
	};
}

// Stylefunktionen Zahnarzt Regionalerversorgungsindex
/**
 * @type {import("leaflet").StyleFunction}
 */
export function rviStyles(feature) {
	const rvi = feature.properties.kategorie;

	return {
		fillColor: getRVIColors(rvi),
		fillOpacity: 0.95,
		opacity: 1,
	};
}

// Stylefunktionen Zahnarzt Lankreis Absolut
/**
 * @type {import("leaflet").StyleFunction}
 */
export function lkzaaStyles(feature) {
	const { za_absolut } = feature.properties;

	return {
		fillColor: getLKZAColors(za_absolut),
		fillOpacity: 0.95,
		opacity: 1,
	};
}

// Stylefunktionen Zahnarzt Lankreis bereinigt
/**
 * @type {import("leaflet").StyleFunction}
 */
export function lkzabStyles(feature) {
	const { za_bereinigt } = feature.properties;

	return {
		fillColor: getLKZAColors(za_bereinigt),
		fillOpacity: 0.95,
		opacity: 1,
	};
}

// Stylefunktionen Zahnarzt Lankreis Hausbesuche
/**
 * @type {import("leaflet").StyleFunction}
 */
export function lkhausStyles(feature) {
	const { hausbesuche } = feature.properties;

	return {
		fillColor: getLKHAUSColors(hausbesuche),
		fillOpacity: 0.95,
		opacity: 1,
	};
}

// speichern der Stylefunktion in einem Objekt für leichtere aufrufbarkeit
const styleFunctions = {
	zaa: zaaStyles,
	zab: zabStyles,
	haus: hausStyles,
	vi_a: vi_aStyles,
	vi_b: vi_bStyles,
	rvi: rviStyles,
	lkzaa: lkzaaStyles,
	lkzab: lkzabStyles,
	lkhaus: lkhausStyles,
};

// speichern der Farben in Objekt für leichtere Aufrufbarkeit
const colorObjects = {
	zaa: ZA_COLORS,
	zab: ZA_COLORS,
	haus: ZA_COLORS,
	vi_a: VI_COLORS,
	vi_b: VI_COLORS,
	rvi: RVI_COLORS,
	lkzaa: LKZA_COLORS,
	lkzab: LKZA_COLORS,
	lkhaus: LKHAUS_COLORS,
};

// Funktion um die Legende und Farben je nach ausgewählten Layer und Daten anzupassen
/**
 * @param {import("leaflet").FeatureGroup<any>} gemeindeLayer
 * @param {import("leaflet").FeatureGroup<any>} landkreisLayer
 */
export function addStyleFunction(gemeindeLayer, landkreisLayer, legend) {
	// Wählen aller Knöpfe in Kontrolbar
	const buttonElements = document.getElementsByClassName('styleButton');

	// Für jeden Knopf die Daten und ID des Knopfs auslesen
	const buttonList = Array.from(buttonElements);
	buttonList.forEach((button) => {
		const style = button.dataset.style;
		const dataID = button.dataset.id;

		// Bei Knopfdruck je nach Knopf das Styling umschalten
		button.onclick = () => {
			// Optionen für Gemeinde
			if (dataID === 'gD') {
				landkreisLayer.bringToBack();
				landkreisLayer.setStyle({
					fillOpacity: 0,
					opacity: 0,
				});
				// Farben setzen auf Basis des Knopfstyles
				gemeindeLayer.setStyle(styleFunctions[style]);
				// OPtionen für Landkreis
			} else if (dataID === 'lkD') {
				gemeindeLayer.bringToBack();
				gemeindeLayer.setStyle({
					fillOpacity: 0,
					opacity: 0,
				});
				// Farben setzen auf Basis des Knopfstyles
				landkreisLayer.setStyle(styleFunctions[style]);
			}

			// Ändern der Legende auf Basis der Knöpfe
			legend.setContent(getLegendHTML(colorObjects[style], `legend-${style}`));

			// Styling von allen Knöpfen entfernen
			buttonList.forEach((button) => button.classList.remove('active'));

			// Styling für den gewählten Knopf ändern.
			button.classList.add('active');
		};
	});
}
