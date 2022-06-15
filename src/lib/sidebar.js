
// in den Daten ist alles Lowercase zum anzeigen werden die Daten Capitalized
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Die Sidebar (anzeigen der gespeicherten Daten) anpassen wenn eine Gemeinde/Landkreis gewählt wurde
export function updateSidebar(gemeindeDaten) {
  const keys = Object.keys(gemeindeDaten);

  const sideBarList = document.getElementsByClassName("sideBar-data-list")[0];
  sideBarList.innerHTML = "";

  keys.forEach((key) => {
    const liElement = document.createElement("li");
    liElement.classList.add("data-list-item");
    liElement.innerHTML = `<div class="data-list-key">${capitalize(
      key
    )}:</div> <div class="data-list-value">${gemeindeDaten[key]}</div>`;

    sideBarList.appendChild(liElement);
  });
}
