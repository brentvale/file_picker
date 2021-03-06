'use strict'

var INDENT_PER_LEVEL = 25;
var INITIAL_PADDING_LEFT = 15;
var TEXT_EXTRA_PADDING = 15;

function Builder(params){
  this.document = params.document;
  this.store = new DataStore();
}

Builder.prototype = {
  addEventListener: function(){
    var that = this;
    this.document.addEventListener('click', function (event) {
      var targetId = event.target.getAttribute('data-id');

      if(targetId){
        //user clicks directly on the +/- button
        that.store.toggleExpandOrContract(targetId, that.render.bind(that));
      } else {
        //user clicked elsewhere and row should be highlighted blue
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
  },
  build: function(){
    var that = this;
    this.buildInitialLayout(function(){
      that.addEventListener();
      that.store.buildDataStructure({ document: that.document, callback: that.render.bind(that)});
    });
  },
  buildInitialLayout: function(callback){
  // <div id="main">
  //     <div id="modal">
  //        <div id="title" class="flex-align section">
  //           <h1>Title</h1>
  //           <span class="x-close mask-buttonable"></span>
  //        </div>
  //       <div id="label" class="flex-align section">
  //          <h3>Label</h3>
  //       </div>
  //       <div id="modalBody">
  //
  //       </div>
  //       <div id="footer" class="flex-align section">
  //          <a>Link</a>
  //          <button class="submit">Done</button>
  //       </div>
  //   </div>
  // </div>

    // MAIN container
    var mainDiv = this.document.createElement("DIV");
    mainDiv.setAttribute("id", "main");

      // MODAL
      var modalDiv = this.document.createElement("DIV");
      modalDiv.setAttribute("id", "modal");

        // TITLE SECTION
        var titleDiv = this.document.createElement("DIV");
        titleDiv.setAttribute("id", "title");
        titleDiv.className = "flex-align section";

          // H1
          var titleEl = this.document.createElement("H1");
          titleEl.innerHTML = "Title";
          modalDiv.appendChild(titleEl);

          // SPAN
          var titleSpan = this.document.createElement("span");
          titleSpan.className = "x-close mask-buttonable";
          modalDiv.appendChild(titleSpan);

        titleDiv.appendChild(titleEl);
        titleDiv.appendChild(titleSpan);

      modalDiv.appendChild(titleDiv);

        // LABEL SECTION
        var labelDiv = this.document.createElement("DIV");
        labelDiv.setAttribute("id", "label");
        labelDiv.className = "flex-align section";

          // H3
          var labelTitleEl = this.document.createElement("H3");
          labelTitleEl.innerHTML = "Label";

        labelDiv.appendChild(labelTitleEl);

      modalDiv.appendChild(labelDiv);

        // MODAL BODY
        var modalBody = this.document.createElement("DIV");
        modalBody.setAttribute("id", "modalBody");

      modalDiv.appendChild(modalBody);

        // FOOTER
        var footerDiv = this.document.createElement("DIV");
        footerDiv.setAttribute("id", "footer");
        footerDiv.className = "flex-align section";

          // anchor
          var linkEl = this.document.createElement("A");
          linkEl.innerHTML = "Link";

          // BUTTON
          var button = this.document.createElement("BUTTON");
          button.innerHTML = "Done";
          button.className = "submit";

        footerDiv.appendChild(linkEl);
        footerDiv.appendChild(button);

      modalDiv.appendChild(footerDiv);
    mainDiv.appendChild(modalDiv);

    this.document.body.appendChild(mainDiv);
    callback();
  },
  calculateIndent: function(data){
    switch(data.type){
      case "text":
        return data.level * INDENT_PER_LEVEL + INITIAL_PADDING_LEFT + TEXT_EXTRA_PADDING;
      case "element":
        return data.level * INDENT_PER_LEVEL + INITIAL_PADDING_LEFT;
    }
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
  selectedClassName: function(data){
    if(data.selected){
      if(data.category === "head"){
        return "row private-selected";
      } else if(data.category === "body"){
        return "row selected";
      }
    } else {
      return "row";
    }
  },
  createDivContainer: function(data, indent){
    var div = this.document.createElement("DIV");

    div.className = this.selectedClassName(data);

    var paddingStyle = "padding-left:" + indent + "px";
    div.setAttribute("style", paddingStyle);
    div.setAttribute('row-id', data.id);
    return div;
  },
  createIconDiv: function(data){
    var iconClass = this.iconClass(data);
    var innerDiv = this.document.createElement("DIV");
    innerDiv.className = iconClass;
    return innerDiv;
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
  createTitle: function(data){
    var titleClass = this.titleClass(data);
    var title = this.document.createElement("H3");
    title.className = titleClass;

    var titleText = this.document.createTextNode(data.displayText);
    title.appendChild(titleText);
    return title;
  },
  iconClass: function(data){
    switch(data.type){
      case "text":
        return 'document-icon';
      case "element":
        if(data.category === 'body'){
          return 'folder-icon buttonable';
        } else if(data.category === 'head') {
          return 'private-folder-icon buttonable';
        }
    }
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
        var children = [];
        node.children.forEach(function(el){
          children.push(el);
        });
        divsToAppend = [].concat(children, divsToAppend);
      }
    }

    return docFrag;
  },
  titleClass: function(data){
    switch(data.type){
      case "text":
        return 'content-label-document';
      case "element":
        return 'content-label';
    }
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

    var modalBody = this.document.getElementById('modalBody');
    modalBody.appendChild(docFrag);
  }
};

