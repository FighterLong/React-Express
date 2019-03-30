# zgt -- #
# wzx -- ##
.
├── package.json
├── package-lock.json
├── README.md
├── src
│   ├── api                                      #axios请求接口
│   │   ├── index.js
│   │   ├── modules
│   │   │   ├── common.js
│   │   │   ├── infonarion.js
│   │   │   ├── nav-bar.js
│   │   │   └── new-media.js
│   │   └── request.js                            #axios请求函数封装
│   ├── common                                    #公用文件
│   │   ├── imgs
│   │   ├── js                                    #公用js方法
│   │   │   └── pub.js
│   │   └── stylus                                #全局样式
│   │       ├── base.styl
│   │       ├── index.styl
│   │       └── public.styl
│   ├── component                                  #木偶组件
│   │   ├── crop-box                               #裁剪组件
│   │   │   └── index.js
│   │   ├── input-title                            #
│   │   │   ├── input-title.js
│   │   │   └── input-title.styl
│   │   ├── text                                   #文本组件
│   │   │   ├── index.js
│   │   │   └── index.scss
│   │   └── title                                  #模块标题 --- key-depart-brief.js
│   │       ├── index.js
│   │       └── index.styl
│   ├── index.js
│   ├── logo.svg
│   ├── registerServiceWorker.js
│   ├── router
│   │   ├── index.js
│   │   ├── privateRoute.js
│   │   └── route.js
│   ├── store                                       #redux--按模块划分
│   │   ├── base-info
│   │   │   ├── action.js
│   │   │   ├── action-type.js
│   │   │   └── reducer.js
│   │   ├── index.js
│   │   └── nav-bar
│   │       ├── action.js
│   │       ├── action-type.js
│   │       └── reducer.js
│   └── view
│       ├── column                                 #栏目管理
│       │   └── index.js
│       ├── department                             #科室导航
│       │   ├── detail-model.js                    #简介编辑里面的详情模式
│       │   ├── index.js
│       │   ├── index.styl
│       │   └── key-depart-brief.js                #科室简介编辑
│       ├── expert-info                            ##专家信息
│       │   ├── expert-info.js
│       │   └── expert-info.styl
│       ├── information                            #资讯信息
│       │   ├── hospital-dynamic.js                #医院公告
│       │   ├── hospital-info.js                   #医院动态
│       │   ├── hospital.styl                      #
│       │   ├── hosptal-info-edit.js               #
│       │   ├── learning.js                        学术动态
│       │   ├── media-report.js                    #媒体报告
│       │   └── party-build.js                     #党工团建设
│       ├── layout                                 #layout
│       │   ├── child                              
│       │   │   ├── creatmenu.js                   #生成菜单方法
│       │   │   ├── head.js                        #上方导航
│       │   │   ├── menu-list.js                   #模拟菜单
│       │   │   └── sider-bar.js                   #左侧导航菜单
│       │   ├── demo.js
│       │   ├── index.js
│       │   └── index.styl
│       ├── login                                   #登入
│       │   ├── index.js
│       │   └── index.styl
│       ├── new-media                               #新媒体交互
│       │   ├── wechat-info.js                      #微信资讯
│       │   └── wechat-info.styl
│       ├── recruit-tips                            ##招聘启示
│       │   ├── recruit-tips.js
│       │   └── recruit-tips.styl
│       ├── science-reader                          ##科研教学
│       │   ├── science-reader.js
│       │   └── science-reader.styl
│       └── theme-video                             #专题视频
│           ├── theme-video-editor.js               #专题视频编辑
│           ├── theme-video.js
│           └── theme-video.styl
├── tree.md
└── yarn.lock

28 directories, 67 files 
