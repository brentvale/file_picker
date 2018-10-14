'use strict'

function DataStore(params){
  this.data = data;
}

DataStore.prototype = {
  getData: function(){
    return this.data;
  },

  findAndUpdate: function(obj, id) {
    if(obj instanceof Array){
      for(var i = 0; i < obj.length; i ++){
        if(obj[i].id == id){
          obj[i].showChildren = !obj[i].showChildren;
          return;
        }
        if(obj[i].showChildren && obj[i].children && obj[i].children.length){
          this.findAndUpdate(obj[i].children, id);
        }
      }
    }
    return;
  },
  toggleExpandOrContract: function(id, callback){

    this.findAndUpdate(this.data, id);

    callback();
  }
};

const data = [
  {
    id: 1,
    displayText: 'body',
    type: 'element',
    showChildren: false,
    level: 0,
    children: [
      {
        id: 2,
        displayText: 'h1',
        type: 'element',
        showChildren: false,
        level: 1,
        children: [
          {
            id: 3,
            type: 'text',
            displayText: 'An Example Site',
            level: 2,
          }
        ]
      },
      {
        id: 4,
        displayText: 'h3',
        type: 'element',
        showChildren: false,
        level: 1,
        children: [
          {
            id: 5,
            type: 'text',
            displayText: 'To Demonstrate what some nested nodes might look like',
            level: 2,
          }
        ]
      },
      {
        id: 6,
        displayText: 'ul',
        type: 'element',
        showChildren: false,
        level: 1,
        children: [
          {
            id: 7,
            displayText: 'li',
            type: 'element',
            showChildren: false,
            level: 2,
            children: [
              {
                id: 8,
                type: 'text',
                displayText: 'One',
                level: 3,
              }
            ]
          },
          {
            id: 9,
            displayText: 'li',
            type: 'element',
            showChildren: false,
            level: 2,
            children: [
              {
                id: 10,
                type: 'text',
                displayText: 'Two',
                level: 3,
              }
            ]
          },
          {
            id: 11,
            displayText: 'li',
            type: 'element',
            showChildren: false,
            level: 2,
            children: [
              {
                id: 12,
                type: 'text',
                displayText: 'Three',
                level: 3,
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
        level: 1,
        children: [
          {
            id: 14,
            type: 'text',
            displayText: 'Some Text',
            level: 2,
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
          }
        ]
      },
    ]
  }
];