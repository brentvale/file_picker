'use strict'

var INDENT_PER_LEVEL = 25;
var INITIAL_PADDING_LEFT = 15;
var TEXT_EXTRA_PADDING = 15;
var MODAL_WIDTH = 320;
var IMAGE_INDENT = 58; // 14 + 14 + 15 + 15 (image widths + gaps)
var TEXT_INDENT = 29; // 14 + 15 (image width + single gap)

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
        //user clicks directly on the +/- button
        that.store.toggleExpandOrContract(targetId, that.render.bind(that));
      } else {
        //search for nearest parent with 'row' class
        var node = event.target;
        var className = node.className || "none";

        while(!className.match(/row/g) && node.parentNode){
          node = node.parentNode;
          if(node.className){
            className = node.className;
          }
        }

        if(className && className.match(/row/g)){
          var targetRowId = node.getAttribute('row-id');
          that.store.toggleSelectedRow(targetRowId, that.render.bind(that));
        }
      }
    }, false);
    this.render();
  },
  createFolderRow: function(data) {
    var fullIndent = data.level * INDENT_PER_LEVEL + INITIAL_PADDING_LEFT;
    var div = this.document.createElement("DIV");
    div.className = data.selected ? "row selected" : "row";
    var paddingStyle = "padding-left:" + fullIndent + "px";
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
    title.setAttribute("style", "max-width:" + (MODAL_WIDTH - (fullIndent + IMAGE_INDENT)) + "px");
    var titleText = this.document.createTextNode(data.displayText);
    title.appendChild(titleText);
    div.appendChild(title);

    return div;
  },
  createTextRow: function(data){
    var fullIndent = data.level * INDENT_PER_LEVEL + INITIAL_PADDING_LEFT + TEXT_EXTRA_PADDING;
    var div = this.document.createElement("DIV");
    div.className = data.selected ? "row selected" : "row";
    var paddingStyle = "padding-left:" + fullIndent + "px";
    div.setAttribute("style", paddingStyle);
    div.setAttribute('row-id', data.id);

    var innerDiv = this.document.createElement("DIV");
    innerDiv.className = "document-icon";
    div.appendChild(innerDiv);

    var title = this.document.createElement("H3");
    title.className = "content-label-document";
    title.setAttribute("style", "max-width:" + (MODAL_WIDTH - (fullIndent + TEXT_INDENT)) + "px");
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