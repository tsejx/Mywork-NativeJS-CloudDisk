var user_data = {
  maxId: 7,
  files: [
    {
      name: 'Root',
      id: 0,
      type: 'root',
      children: [
        {
          name: 'Front Frame',
          id: 1,
          pId: 0,
          type:'folder',
          children: [
            {
              name: 'React',
              id: 4,
              pId: 1,
              type:'folder',
              children: []
            },
            {
              name: 'Vue',
              id: 5,
              pId: 1,
              type:'folder',
              children: [
                {
                  name: 'vue-cli',
                  id: 6,
                  pId: 5,
                  type:'folder',
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
          children: []
        },
        {
          name: 'CSS3',
          id: 3,
          pId: 0,
          type:'folder',
          children:[]
        }
      ]
    }    
  ]
};
