'use strict'

var INDENT_PER_LEVEL = 25;
var INITIAL_PADDING_LEFT = 15;
var TEXT_EXTRA_PADDING = 15;

function Builder(params){
  this.document = params.document;
  this.store = new DataStore();
}

Builder.prototype = {
  build: function(){
    var that = this;
    this.document.addEventListener('click', function (event) {
      var targetId = event.target.getAttribute('data-id');
      var className = event.target.className;

      if(targetId){
        that.store.toggleExpandOrContract(targetId, that.render.bind(that));
      }
      if(className.match(/row/g)){

        var targetRowId = event.target.getAttribute('row-id');
        console.log("MATCHES", targetRowId, className)
        that.store.toggleSelectedRow(targetRowId, that.render.bind(that));
      }
    }, false);
    this.render();
  },
  createFolderRow: function(data) {
    var div = this.document.createElement("DIV");
    div.className = data.selected ? "row selected" : "row";
    var paddingStyle = "padding-left:" +
      (data.level * INDENT_PER_LEVEL + INITIAL_PADDING_LEFT) + "px";
    div.setAttribute("style", paddingStyle);
    div.setAttribute('row-id', data.id);

    var button = this.document.createElement("BUTTON");

    if(data.showChildren){
      button.className = "folder-expanded mask-buttonable";
    } else {
      button.className = "folder-contracted mask-buttonable";
    }
    button.setAttribute('data-id', data.id);
    div.appendChild(button);

    var innerDiv = this.document.createElement("DIV");
    innerDiv.className = "folder-icon buttonable";
    div.appendChild(innerDiv);

    var title = this.document.createElement("H3");
    title.className = "content-label";
    var titleText = this.document.createTextNode(data.displayText);
    title.appendChild(titleText);
    div.appendChild(title);

    return div;
  },
  createTextRow: function(data){
    var div = this.document.createElement("DIV");
    div.className = data.selected ? "row selected" : "row";
    var paddingStyle = "padding-left:" +
      (data.level * INDENT_PER_LEVEL + TEXT_EXTRA_PADDING + INITIAL_PADDING_LEFT) + "px";
    div.setAttribute("style", paddingStyle);
    div.setAttribute('row-id', data.id);

    var innerDiv = this.document.createElement("DIV");
    innerDiv.className = "document-icon";
    div.appendChild(innerDiv);

    var title = this.document.createElement("H3");
    title.className = "content-label";
    var titleText = this.document.createTextNode(data.displayText);
    title.appendChild(titleText);
    div.appendChild(title);

    return div;
  },
  prepareRenderableElements: function(){

    var docFrag = this.document.createDocumentFragment();
    var divsToAppend = [];
    this.store.data.forEach(function(el){
      divsToAppend.push(el);
    });

    while(divsToAppend.length){
      var node = divsToAppend.shift();
      var div = null;

      switch(node.type){
        case "element":
          div = this.createFolderRow(node);
          break;
        case "text":
          div = this.createTextRow(node);
          break;
      }

      if(div){
        docFrag.appendChild(div);
      }

      if(node.showChildren && node.children && node.children.length){
        node.children.forEach(function(el){
          divsToAppend.unshift(el);
        });
      }
    }

    return docFrag;
  },
  removeChildren: function(targetId){
    var node = this.document.getElementById(targetId);
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  },
  render: function() {
    this.removeChildren('modalBody');
    var docFrag = this.prepareRenderableElements();

    modalBody.appendChild(docFrag);
  }
};