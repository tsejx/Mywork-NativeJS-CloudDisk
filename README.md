# 原生JS概念云盘实战作品 Cloud-Disk

**加载页**

![加载页][1]

**云盘主页**

![云盘主页][2]

**布局转换**

![布局转换][3]

**移动文件夹**

![移动文件夹][4]

**画框多选**

![画框多选][6]

**右键菜单**

![右键菜单][5]

## 技术栈

JavaScript（DOM/BOM） + CSS3 + HTML

## 快速开始

    本实战作品为静态页面，直接在浏览器打开即可预览效果
    进入登录页面 index.html 
    直接进入主页 home.html
    
## 项目目录

    .
    ├─ doc/                 # 文档目录
    ├─ img/                 # 图像目录
    ├─ ui/                  # UI设计稿
    ├─ css/                 # CSS样式文件夹
    │   ├── alert.css/      # 消息弹窗样式
    │   ├── file.css/       # 文件内容样式
    │   ├── login.css/      # 登录页样式
    │   ├── master.css/     # 主页样式
    │   ├── reset.css/      # 重置样式
    ├── js/                 # JavaScript脚本文件夹
    │   ├── createHtml.js/  # 页面结构生成脚本
    │   ├── data.js/        # 应用数据
    │   ├── feature.js/     # 文件操作功能脚本
    │   ├── login.js/       # 登录页脚本
    │   ├── mouse.js/       # 鼠标事件脚本
    │   ├── tool.js         # 工具脚本
    │   ├── view.js         # 视图层脚本
    ├── favicon.ico         # 网页图标
    ├── home.html           # 主页静态页面
    ├── index.html          # 登录页静态页面
    
## 功能特色
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
 
（详细原型设计请参考脑图）

## 项目描述

- 在遵循W3C标准及前端开发规范基础上，依照设计稿搭建语义化的页面架构
- 利用Photoshop等图像编辑软件制作CSS Spirit图
- 运用CSS3过渡/动画/弹性盒子等新特性效果美化UI界面
- 根据实际开发需要，封装规范化的JavaScript函数
- 利用DOM/BOM操作应用元素，并通过Event对象实现鼠标画框/右键菜单等功能

本项目在对应用页面进行艺术设计的基础上，运用了表现形式和数据结构分离的MVC原理，实现具备新建/删除/重命名/移动/拷贝/剪切/鼠标画框/右键菜单等功能的模拟云盘应用。

## MindMap

![概念云盘思维导图][7]


  [1]: http://wx3.sinaimg.cn/mw690/c0096cf9ly1fhznp3uqg9j214u0loaa6.jpg
  [2]: http://wx1.sinaimg.cn/mw690/c0096cf9ly1fhznpbesbrj214u0lo3zm.jpg
  [3]: http://wx1.sinaimg.cn/mw690/c0096cf9ly1fhznpgzgofj214u0lodh4.jpg
  [4]: http://wx2.sinaimg.cn/mw690/c0096cf9ly1fhznpmbwqpj214u0loq5k.jpg
  [5]: http://wx2.sinaimg.cn/mw690/c0096cf9ly1fhznppdziyj20ko0g874p.jpg
  [6]: http://wx1.sinaimg.cn/mw690/c0096cf9ly1fhzo4g1h3lj214u0lo3zw.jpg
  [7]: http://upload-images.jianshu.io/upload_images/3376841-ff5ea58bbd4d7a25.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240