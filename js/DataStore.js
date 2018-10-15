'use strict'

var ELEMENT_NODE = {
  id: null,
  category: '', //head or body
  children: [],
  displayText: '', //name of element
  level: -1,
  selected: false,
  showChildren: false,
  type: 'element',
};

var TEXT_NODE = {
  id: null,
  category: '',
  displayText: '',
  level: -1,
  selected: false,
  type: 'text'
};

function DataStore(){
  this.data = [];
}

DataStore.prototype = {
  createHeadAndBodyNodes: function(document){
    //assumes inital page layout similar to index.html
    var nodes = [];
    var htmlNode = document.childNodes[1];
    var documentChildren = Array.from(htmlNode.childNodes);

    var bodyNode = null;
    var headNode = null;

    documentChildren.forEach(function(node){
      if(node.nodeName === 'BODY'){
        bodyNode = Object.assign({}, ELEMENT_NODE, {
          id: 1,
          category: 'body',
          displayText: 'body',
          level: 0,
          node: node,
        });
      }
      if(node.nodeName === 'HEAD'){
        headNode = Object.assign({}, ELEMENT_NODE, {
          id: 2,
          category: 'head',
          displayText: 'head',
          level: 0,
          node: node,
        });
      }
    });

    if(bodyNode){
      nodes.push(bodyNode);
    }
    if(headNode){
      nodes.push(headNode);
    }

    return nodes;
  },
  uuid: function(){
    return Math.round(Math.random()*100000);
  },
  createNodeAndChildren: function(params){
    if(params.node.nodeType !== 1 && params.node.nodeType !==3){
      return;
    }
    //TEXT NODE
    if(params.node.nodeType === 3){
      //don't add empty or newline only strings
      if(!params.node.nodeValue.replace(/\s/g, '').length){
        return;
      }
      return Object.assign({}, TEXT_NODE, {
        id: this.uuid(),
        category: params.category,
        displayText: params.node.nodeValue,
        level: params.level + 1,
        node: params.node,
        type: 'text'
      });
    }
    //ELEMENT NODE
    if(params.node.nodeType === 1){
      var newNode = Object.assign({}, ELEMENT_NODE, {
        id: this.uuid(),
        category: params.category,
        displayText: params.node.localName,
        level: params.level + 1,
        node: params.node,
        type: 'element'
      });
      if(params.node.hasChildNodes()){
        var that = this;
        var children = Array.from(params.node.childNodes);
        var structuredChildren = [];
        children.forEach(function(child){
          var structuredChild = that.createNodeAndChildren({
            node: child,
            level: params.level + 1,
            category: params.category
          });
          if(structuredChild){
            structuredChildren.push(structuredChild);
          }
        });
        newNode.children = structuredChildren;
      }
      return newNode;
    }
  },
  buildDataStructure: function(params){
    var nodes = this.createHeadAndBodyNodes(params.document);

    var that = this;
    nodes.forEach(function(node){
      var children = Array.from(node.node.childNodes);
      var structuredChildren = [];
      children.forEach(function(child){
        var structuredChild = that.createNodeAndChildren({
          node: child,
          level: node.level,
          category: node.category
        });
        if(structuredChild){
          structuredChildren.push(structuredChild);
        }
      });
      node.children = structuredChildren;
      that.data.push(node);
    });

    params.callback();
  },
  findAndUpdateExpanded: function(obj, id) {
    if(obj instanceof Array){
      for(var i = 0; i < obj.length; i ++){
        if(obj[i].id == id){
          obj[i].showChildren = !obj[i].showChildren;
          return;
        }
        if(obj[i].showChildren && obj[i].children && obj[i].children.length){
          this.findAndUpdateExpanded(obj[i].children, id);
        }
      }
    }
  },
  findAndUpdateSelectedRow: function(obj, id) {
    if(obj instanceof Array){
      for(var i = 0; i < obj.length; i ++){
        if(obj[i].id == id){
          obj[i].selected = !obj[i].selected;
        }
        if(obj[i].selected && obj[i].id != id){
          obj[i].selected = false;
        }
        if(obj[i].children && obj[i].children.length){
          this.findAndUpdateSelectedRow(obj[i].children, id);
        }
      }
    }
  },
  toggleExpandOrContract: function(id, callback){
    this.findAndUpdateExpanded(this.data, id);
    callback();
  },
  toggleSelectedRow: function(id, callback){
    this.findAndUpdateSelectedRow(this.data, id);
    callback();
  }
};

const data = [
  {
    id: 1,
    displayText: 'body',
    type: 'element',
    category: 'body',
    showChildren: false,
    selected: false,
    level: 0,
    children: [
      {
        id: 2,
        displayText: 'h1 and then some other stuff and more that goes here.',
        type: 'element',
        category: 'body',
        showChildren: false,
        selected: false,
        level: 1,
        children: [
          {
            id: 3,
            type: 'text',
            category: 'body',
            displayText: 'An Example Site',
            level: 2,
            selected: false,
          }
        ]
      },
      {
        id: 4,
        displayText: 'h3',
        type: 'element',
        category: 'body',
        showChildren: false,
        selected: false,
        level: 1,
        children: [
          {
            id: 5,
            type: 'text',
            category: 'body',
            displayText: 'To Demonstrate what some nested nodes might look like',
            level: 2,
            selected: false,
          }
        ]
      },
      {
        id: 6,
        displayText: 'ul',
        type: 'element',
        category: 'body',
        showChildren: false,
        selected: false,
        level: 1,
        children: [
          {
            id: 7,
            displayText: 'li',
            type: 'element',
            category: 'body',
            showChildren: false,
            selected: false,
            level: 2,
            children: [
              {
                id: 8,
                type: 'text',
                category: 'body',
                displayText: 'One',
                level: 3,
                selected: false,
              }
            ]
          },
          {
            id: 9,
            displayText: 'li',
            type: 'element',
            category: 'body',
            showChildren: false,
            selected: false,
            level: 2,
            children: [
              {
                id: 10,
                type: 'text',
                displayText: 'Two',
                level: 3,
                selected: false,
              }
            ]
          },
          {
            id: 11,
            displayText: 'li',
            type: 'element',
            category: 'body',
            showChildren: false,
            selected: false,
            level: 2,
            children: [
              {
                id: 12,
                type: 'text',
                category: 'body',
                displayText: 'Three',
                level: 3,
                selected: false,
              }
            ]
          }
        ]
      },
      {
        id: 13,
        displayText: 'p',
        type: 'element',
        category: 'body',
        showChildren: false,
        selected: false,
        level: 1,
        children: [
          {
            id: 16,
            displayText: 'span',
            type: 'element',
            category: 'body',
            showChildren: false,
            selected: false,
            level: 2,
            children: [
              {
                id: 17,
                displayText: 'span',
                type: 'element',
                category: 'body',
                showChildren: false,
                selected: false,
                level: 3,
                children: [
                  {
                    id: 18,
                    displayText: 'span',
                    type: 'element',
                    category: 'body',
                    showChildren: false,
                    selected: false,
                    level: 4,
                    children: [
                      {
                        id: 19,
                        displayText: 'span',
                        type: 'element',
                        category: 'body',
                        showChildren: false,
                        selected: false,
                        level: 5,
                        children: [
                          {
                            id: 20,
                            type: 'text',
                            category: 'body',
                            displayText: 'Some Text: short',
                            level: 6,
                            selected: false,
                          },
                          {
                            id: 21,
                            type: 'text',
                            category: 'body',
                            displayText: 'Some Text that could be short or long',
                            level: 6,
                            selected: false,
                          },
                          {
                            id: 22,
                            displayText: 'span',
                            type: 'element',
                            category: 'body',
                            showChildren: false,
                            selected: false,
                            level: 6,
                            children: [
                              {
                                id: 23,
                                displayText: 'span',
                                type: 'element',
                                category: 'body',
                                showChildren: false,
                                selected: false,
                                level: 7,
                                children: [
                                  {
                                    id: 24,
                                    displayText: 'span',
                                    type: 'element',
                                    category: 'body',
                                    showChildren: false,
                                    selected: false,
                                    level: 8,
                                    children: [
                                      {
                                        id: 25,
                                        displayText: 'span',
                                        type: 'element',
                                        category: 'body',
                                        showChildren: false,
                                        selected: false,
                                        level: 9,
                                        children: [
                                          {
                                            id: 26,
                                            type: 'text',
                                            category: 'body',
                                            displayText: 'Some Text that could be short or long',
                                            level: 10,
                                            selected: false,
                                          },
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 14,
            type: 'text',
            category: 'body',
            displayText: 'Some Text',
            level: 2,
            selected: false,
          },
          // {
          //                   id: 15,
          //                   type: 'comment',
          //                 },
          {
            id: 15,
            type: 'text',
            category: 'body',
            displayText: 'More Text',
            level: 2,
            selected: false,
          }
        ]
      },
    ]
  },
  {
    id: 27,
    displayText: 'head',
    type: 'element',
    category: 'head',
    showChildren: false,
    selected: false,
    level: 0,
    children: [
      {
        id: 28,
        displayText: 'h1 and then some other stuff and more that goes here.',
        type: 'element',
        category: 'head',
        showChildren: false,
        selected: false,
        level: 1,
        children: [
          {
            id: 29,
            type: 'text',
            category: 'head',
            displayText: 'An Example Site',
            level: 2,
            selected: false,
          }
        ]
      },
    ]
  }
];