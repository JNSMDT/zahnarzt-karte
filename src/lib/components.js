// Legenden Komponente 
// Anpassen der Funktionalitäten und Styling
export const Legend = L.Control.extend({
  onAdd: function (map) {
    // add reference to mapinstance
    map.legend = this;

    // create container
    var container = L.DomUtil.create("div", "legend");

    // if content provided
    if (this.options.content) {
      // set content
      container.innerHTML = this.options.content;
    }
    return container;
  },
  onRemove: function (map) {
    // remove reference from mapinstance
    delete map.legend;
  },

  // new method for setting innerHTML
  setContent: function (str) {
    this.getContainer().innerHTML = str;
  },
});
