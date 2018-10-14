'use strict'

function DataStore(params){
  this.data = data;
}

DataStore.prototype = {
  getData: function(){
    return this.data;
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
    showChildren: false,
    selected: false,
    level: 0,
    children: [
      {
        id: 2,
        displayText: 'h1 and then some other stuff and more that goes here.',
        type: 'element',
        showChildren: false,
        selected: false,
        level: 1,
        children: [
          {
            id: 3,
            type: 'text',
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
        showChildren: false,
        selected: false,
        level: 1,
        children: [
          {
            id: 5,
            type: 'text',
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
        showChildren: false,
        selected: false,
        level: 1,
        children: [
          {
            id: 7,
            displayText: 'li',
            type: 'element',
            showChildren: false,
            selected: false,
            level: 2,
            children: [
              {
                id: 8,
                type: 'text',
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
            showChildren: false,
            selected: false,
            level: 2,
            children: [
              {
                id: 12,
                type: 'text',
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
        showChildren: false,
        selected: false,
        level: 1,
        children: [
          {
            id: 16,
            displayText: 'span',
            type: 'element',
            showChildren: false,
            selected: false,
            level: 2,
            children: [
              {
                id: 17,
                displayText: 'span',
                type: 'element',
                showChildren: false,
                selected: false,
                level: 3,
                children: [
                  {
                    id: 18,
                    displayText: 'span',
                    type: 'element',
                    showChildren: false,
                    selected: false,
                    level: 4,
                    children: [
                      {
                        id: 19,
                        displayText: 'span',
                        type: 'element',
                        showChildren: false,
                        selected: false,
                        level: 5,
                        children: [
                          {
                            id: 20,
                            type: 'text',
                            displayText: 'Some Text: short',
                            level: 6,
                            selected: false,
                          },
                          {
                            id: 21,
                            type: 'text',
                            displayText: 'Some Text that could be short or long',
                            level: 6,
                            selected: false,
                          },
                          {
                            id: 22,
                            displayText: 'span',
                            type: 'element',
                            showChildren: false,
                            selected: false,
                            level: 6,
                            children: [
                              {
                                id: 23,
                                displayText: 'span',
                                type: 'element',
                                showChildren: false,
                                selected: false,
                                level: 7,
                                children: [
                                  {
                                    id: 24,
                                    displayText: 'span',
                                    type: 'element',
                                    showChildren: false,
                                    selected: false,
                                    level: 8,
                                    children: [
                                      {
                                        id: 25,
                                        displayText: 'span',
                                        type: 'element',
                                        showChildren: false,
                                        selected: false,
                                        level: 9,
                                        children: [
                                          {
                                            id: 26,
                                            type: 'text',
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
            displayText: 'More Text',
            level: 2,
            selected: false,
          }
        ]
      },
    ]
  }
];