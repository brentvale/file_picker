function Builder(params){
  this.document = params.document;
  this.store = new DataStore();
}

Builder.prototype = {
  build: function(){
    var that = this;
    this.document.addEventListener('click', function (event) {
      var targetId = event.target.getAttribute('data-id');
      if(targetId){
        that.store.updateTree(targetId);
      }
    }, false);
    this.render();
  },
  createFolderRow: function(data) {
    var div = this.document.createElement("DIV");
    div.className = "folder-row";

    var button = this.document.createElement("BUTTON");
    button.className = "folder-contracted mask-buttonable";
    button.setAttribute('data-id', data.id);
    div.appendChild(button);

    var innerDiv = this.document.createElement("DIV");
    innerDiv.className = "folder-icon buttonable";
    div.appendChild(innerDiv);

    var title = this.document.createElement("H3");
    title.className = "folder-label";
    var titleText = this.document.createTextNode(data.displayText);
    title.appendChild(titleText);
    div.appendChild(title);

    return div;
  },

  render: function(data) {
    var modalBody = this.document.getElementById('modalBody');

    var target = this.store.data[0];
    var div = this.createFolderRow(target);

    modalBody.append(div);

  }
};