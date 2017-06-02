# 原生JS Cloud Disk Project 

## HTML

    index.html /*云盘登录页*/
    home.html /*云盘内容页*/

## CSS

    reset.css /*初始化样式*/
    login.css /*云盘登录页样式表*/
    master.css /*云盘内容页主体样式表*/
    file.css /*云盘文档相关样式表*/
    alert.css /*云盘内容页弹窗灯箱样式表*/

## Javascript
    
    too.js /*工具函数*/
    data.js /*模拟JSON数据*/
    createHtml.js /*页面结构生成的相关函数*/
    feature.js /*文件操作的功能函数*/
    view.js /*视图层相关函数*/
    mouse.js /*鼠标操作相关函数*/
    
    
## 功能说明
 1. 选中文件夹
  - 选中文件夹
  - 全选文件夹

 2. 重命名文件夹
  - 对已有文件夹重命名
  - 新建文件夹重命名

 3. 新建文件夹
   - 是否正在重命名
   - 一次只能重命名一个文件夹

 4. 移动文件夹
   - 不能移动到自身及自身的子目录和父目录
   - 如果移动的目标目录有相同的名字，要做一些操作
    
 5. 删除文件夹
   - 如果不选中，不能删除
   - 最少选中一个

 6. 复制/剪切/粘贴文件夹
 
 7. 布局转换

 8. 文件排序
 
 8. 活动窗树状目录栏
  - 随着数据更新而更新

 9. 右键菜单及其子菜单
  - 菜单及其子菜单的溢出处理
  - 子菜单悬浮显示的问题

 10. 消息灯箱/咨询弹窗
 
（详细信息参考思维导图）
## MindMap


## Coding Summary
![概念云盘思维导图][1]

### HTML
1） 添加浏览器标签网页图标

(1)favicon图标要求
位色 :　8 / 24
像素 :　16*16px / 32*32px
格式 : png / ico / gif

(2)把图标放在根目录下

(3)在html表头head添加link
```
<link rel="shortcut icon" type="image/x-icon" href="./favicon.ico" > 
```

2） HTML5 input placeholder属性

placeholder 属性规定可描述输入字段预期值的简短的提示信息（比如：一个样本值或者预期格式的短描述）。

该提示会在用户输入值之前显示在输入字段中。

注意：placeholder 属性适用于下面的 input 类型：text、search、url、tel、email 和 password。

### CSS
1） flex布局相关 
2） 选择器span + span 
3） keyframes 关键帧 

### Javascript

1）对象的深拷贝

    var obj = { name: 'FungLeo', sex: 'man', old: '18' } 
    var obj2 = JSON.parse(JSON.stringify(obj))


  [1]: http://upload-images.jianshu.io/upload_images/3376841-ff5ea58bbd4d7a25.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240