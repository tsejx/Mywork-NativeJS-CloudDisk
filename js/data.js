var user_data = {
  maxId: 9,
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
          time: '2017-10-02',
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
          time: '2017-01-01',
          children: []
        },
        {
          name: 'CSS3',
          id: 3,
          pId: 0,
          type:'folder',
          time: '2017-05-01',
          children:[]
        },
        {
          name : 'Mindmap',
          id : 7,
          pId : 0,
          type : 'image',
          time : '2017-03-28',
          children :[]
        },
        {
          name : 'BookNotes',
          id : 8,
          pId : 0,
          type : 'note',
          time : '2017-04-28',
          children :[]
        }
      ]
    }    
  ]
};

var dataContextMenu = [{
  menuname: 'document',
  data: [{
    name: '查看',
    classname: 'parent-menu view-way',
    childname: 'view-menu',
    children: [{
      name: '缩略图布局',
      classname: 'preview-way'
    }, {
      name: '列表布局',
      classname: 'list-way'
    }]
  }, {
    name: '排序',
    classname: 'parent-menu sort-way',
    childname: 'sort-menu',
    children: [{
      name: 　 '名称排序',
      classname: 'letter-way'
    }, {
      name: '大小排序',
      classname: 'size-way'
    }, {
      name: '时间排序',
      classname: 'time-way'
    }]
  },{
    name: '粘贴',
    classname: 'file-paste',
  },{
    name: '新建文件夹',
    classname: 'file-create'
  }, {
    name: '重新加载页面',
    classname: 'reload'
  }]
}, {
  menuname: 'file',
  data: [{
    name: '打开',
    classname: 'file-open',
  }, {
    name: '拷贝',
    classname: 'file-copy',
  }, {
    name: '剪切',
    classname: 'file-cut',
  },{
    name : '重命名',
    classname : 'file-rename-contextmenu',
  } 
  ,{
    name: '移动到',
    classname: 'file-move',
  }]
}];