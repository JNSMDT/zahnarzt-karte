// Die Sidebar (anzeigen der gespeicherten Daten) anpassen wenn eine Gemeinde/Landkreis gewählt wurde
export function updateSidebar(gemeindeDaten) {
	console.log({ gemeindeDaten });
	const keys = Object.keys(gemeindeDaten);

	const sideBarList = document.getElementsByClassName('sideBar-data-list')[0];
	sideBarList.innerHTML = '';

	keys.forEach((key) => {
		const liElement = document.createElement('li');
		liElement.classList.add('data-list-item');
		liElement.innerHTML = `<div class="data-list-key">${key}:</div> <div class="data-list-value">${gemeindeDaten[key]}</div>`;

		sideBarList.appendChild(liElement);
	});
}
