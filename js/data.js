var user_data = {
  maxId: 7,
  files: [
    {
      name: 'Root',
      id: 0,
      type: 'root',
      time: '2017-01-01',
      children: [
        {
          name: 'Front Frame',
          id: 1,
          pId: 0,
          type:'folder',
          time: '2017-01-02',
          children: [
            {
              name: 'React',
              id: 4,
              pId: 1,
              type:'folder',
              time: '2017-01-03',
              children: []
            },
            {
              name: 'Vue',
              id: 5,
              pId: 1,
              type:'folder',
              time: '2017-01-04',
              children: [
                {
                  name: 'vue-cli',
                  id: 6,
                  pId: 5,
                  type:'folder',
                  time: '2017-01-04',
                  children: []
                }
              ]
            }
          ]
        },
        {
          name: 'HTML5',
          id: 2,
          pId: 0,
          type:'folder',
          time: '2017-02-01',
          children: []
        },
        {
          name: 'CSS3',
          id: 3,
          pId: 0,
          type:'folder',
          time: '2017-03-01',
          children:[]
        }
      ]
    }    
  ]
};
