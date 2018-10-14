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
  createDivContainer: function(data, indent){
    var div = this.document.createElement("DIV");
    div.className = data.selected ? "row selected" : "row";
    var paddingStyle = "padding-left:" + indent + "px";
    div.setAttribute("style", paddingStyle);
    div.setAttribute('row-id', data.id);
    return div;
  },
  createInnerContainer: function(boxType){
    var div = this.document.createElement("DIV");
    switch(boxType){
      case "fixed":
        break;
      case "fixedMargin":
        div.setAttribute("style", "margin-left: 6px");
        break;
      case "overflow":
        div.setAttribute("style", "overflow:hidden");
        break;
    }
    return div;
  },
  createButton: function(data){
    var button = this.document.createElement("BUTTON");
    if(data.showChildren){
      button.className = "folder-expanded mask-buttonable";
    } else {
      button.className = "folder-contracted mask-buttonable";
    }
    button.setAttribute('data-id', data.id);
    return button;
  },
  createIconDiv: function(data){
    var iconClass = this.iconClass(data);
    var innerDiv = this.document.createElement("DIV");
    innerDiv.className = iconClass;
    return innerDiv;
  },
  createTitle: function(data){
    var titleClass = this.titleClass(data);
    var title = this.document.createElement("H3");
    title.className = titleClass;

    var titleText = this.document.createTextNode(data.displayText);
    title.appendChild(titleText);
    return title;
  },
  calculateIndent: function(data){
    switch(data.type){
      case "text":
        return data.level * INDENT_PER_LEVEL + INITIAL_PADDING_LEFT + TEXT_EXTRA_PADDING;
      case "element":
        return data.level * INDENT_PER_LEVEL + INITIAL_PADDING_LEFT;
    }
  },
  iconClass: function(data){
    switch(data.type){
      case "text":
        return 'document-icon';
      case "element":
        return 'folder-icon buttonable';
    }
  },
  titleClass: function(data){
    switch(data.type){
      case "text":
        return 'content-label-document';
      case "element":
        return 'content-label';
    }
  },
  createRow: function(data){
    var fullIndent = this.calculateIndent(data);

    var div = this.createDivContainer(data, fullIndent);

    if(data.type === "element"){
      var buttonDivContainer = this.createInnerContainer('fixed');
      var button = this.createButton(data);

      buttonDivContainer.appendChild(button);
      div.appendChild(buttonDivContainer);
    }

    var iconDivContainer = this.createInnerContainer('fixedMargin');
    var iconDiv = this.createIconDiv(data);

    iconDivContainer.appendChild(iconDiv);
    div.appendChild(iconDivContainer);

    var titleDivContainer = this.createInnerContainer('overflow');
    var title = this.createTitle(data);

    titleDivContainer.appendChild(title);
    div.appendChild(titleDivContainer);

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

      var div = this.createRow(node);
      docFrag.appendChild(div);

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