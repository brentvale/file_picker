function DataStore(params){
  this.data = data;
}

DataStore.prototype = {
  getData: function(){
    return this.data;
  },
  updateTree: function(id){
    alert(id);
  }
};

const data = [
  {
    id: 1,
    displayText: 'body',
    type: 'element',
    alwaysVisible: true,
    visible: true,
    children: [
      {
        id: 2,
        displayText: 'h1',
        type: 'element',
        visible: false,
        children: [
          {
            id: 3,
            type: 'text',
            visible: false,
            displayText: 'An Example Site',
          }
        ]
      },
      {
        id: 4,
        displayText: 'h3',
        type: 'element',
        visible: false,
        children: [
          {
            id: 5,
            type: 'text',
            visible: false,
            displayText: 'To Demonstrate what some nested nodes might look like',
          }
        ]
      },
      {
        id: 6,
        displayText: 'ul',
        type: 'element',
        visible: false,
        children: [
          {
            id: 7,
            displayText: 'li',
            type: 'element',
            visible: false,
            children: [
              {
                id: 8,
                type: 'text',
                displayText: 'One',
                visible: false,
              }
            ]
          },
          {
            id: 9,
            displayText: 'li',
            type: 'element',
            visible: false,
            children: [
              {
                id: 10,
                type: 'text',
                displayText: 'Two',
                visible: false,
              }
            ]
          },
          {
            id: 11,
            displayText: 'li',
            type: 'element',
            visible: false,
            children: [
              {
                id: 12,
                type: 'text',
                displayText: 'Three',
                visible: false,
              }
            ]
          }
        ]
      },
      {
        id: 13,
        displayText: 'p',
        type: 'element',
        visible: false,
        children: [
          {
            id: 14,
            type: 'text',
            displayText: 'Some Text',
            visible: false,
          },
          // {
          //                   id: 15,
          //                   type: 'comment',
          //                 },
          {
            id: 15,
            type: 'text',
            displayText: 'More Text',
            visible: false,
          }
        ]
      },
    ]
  }
];