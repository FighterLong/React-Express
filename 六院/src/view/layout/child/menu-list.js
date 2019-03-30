// let navList = [
//   {
//     name: '资讯信息',
//     icon: 'database',
//     submenu: [
//       {
//         name: '医院动态',
//         path: 'DYNAMIC'
//       },
//       {
//         name: '医院公告',
//         path: 'NOTICE'
//       },
//       {
//         name: '媒体报告',
//         path: 'REPORT'
//       },
//       {
//         name: '学术动态',
//         path: 'SCIENCE'
//       },
//       {
//         name: '党工团建设',
//         path: 'PARTY'
//       }
//     ]
//   },
//   {
//     name: '新媒体交互',
//     icon: 'appstore',
//     submenu: [
//       {
//         name: '微信资讯',
//         path: 'WechatInfo'
//       }
//     ]
//   },
//   {
//     name: '专题网站',
//     icon: 'video-camera',
//     path: 'SpecialWebsite'
//   },
//   {
//     name: '专题视频',
//     icon: 'video-camera',
//     path: 'ThemeVideo'
//   },
//   {
//     name: '医院概况',
//     icon: 'pie-chart',
//     submenu:[{
//         name:'院训',
//         path: 'HospitalTraining'
//       },{
//         name:'医院概况',
//         path: 'HospitalTraining'
//       },{
//         name:'医院功能',
//         path: 'HospitalTraining'
//       },{
//         name:'地理位置',
//         path: 'HospitalTraining'
//       },{
//         name:'诊疗中心及先进设备',
//         path: 'HospitalTraining'
//       },{
//         name:'医院特色',
//         path: 'HospitalTraining'
//       },{
//         name:'科研教学成果',
//         path: 'HospitalTraining'
//       },{
//         name:'医院愿景',
//         path: 'HospitalTraining'
//       },{
//         name:'联系我们',
//         path: 'HospitalTraining'
//       },{
//         name:'院领导概况',
//         path: 'HospitalTraining'
//       },{
//         name:'医院历史',
//         path: 'HospitalTraining'
//       },{
//         name:'给患者的一封信',
//         path: 'HospitalTraining'
//       },{
//         name:'执业登记',
//         path: 'HospitalTraining'
//       }]
//   },
//   {
//     name: '首页信息',
//     icon: 'global',
//     submenu: [
//       {
//         name: '轮播图',
//         path: 'homePage' // 根据后面的id去获取对应的科室列表
//       },
//       {
//         name: '页脚内容',
//         path: 'Footer'
//       }
//     ]
//   },
//   {
//     name:'专家信息',
//     icon:'idcard',
//     path:'expertInfo'
//   },{
//     name:'招聘招标',
//     icon:'plus-square-o',
//     submenu:[
//       {name:'人才招聘',
//       submenu:[
//         {name:'招聘启示',
//         path:'recruitTips'},
//         {name:'最新公告'},
//         {name:'表格下载'}
//       ]
//       },
//       {
//         name:'招标采购',
//         submenu:[
//           {name:'采购公告'},
//           {name:'结果公示'},
//           {name:'网上竞价系统'},
//           {name:'申购用户端登陆'},
//           {name:'基建'},
//           {name:'文件制度'},
//           {name:'下载专区'}
//         ]
//       },
//     ]
//   },
//   {
//     name:'科研教学',
//     icon:'pie-chart',
//     submenu:[
//       {name:'科学研究'},
//       {name:'伦理委员会'},
//       {name:'研究生教育'},
//       {name:'研究生招生'},
//       {name:'本科生教育'},
//       {name:'继续教育'},
//       {name:'进修生专区'},
//       {name:'下载专区'},
//       {name:'相关链接'},
//       {name:'医院考试系统'}
//     ]
//   },
//   {
//     name:'疾病科普',
//     icon:'layout',
//     path:'scienceReader'
//   },
//   {
//     name:'就医指南',
//     icon:'pie-chart',
//     submenu:[{
//         name:'急诊指南',
//         path: 'hospitalGuide/EMERGRNCY_TREATMENT_GUIDE'
//       },{
//         name:'门诊指南',
//         path: 'hospitalGuide/OUTPATIENT_SERVICE_GUIDE'
//       },{
//         name:'住院指南',
//         path: 'hospitalGuide/HOSPITALIZATION_GUIDE'
//       },{
//         name:'交通指南',
//         path: 'hospitalGuide/TRANSPORTATION_GUIDE'
//       },{
//         name:'预约方式',
//         path: 'hospitalGuide/APPOINTMENT_MODE'
//       },{
//         name:'先进技术及设备',
//         path: 'hospitalGuide/ADVANCED_TECHNOLOGY_EQUIPMENT'
//       },{
//         name:'医疗服务承诺',
//         path: 'hospitalGuide/MEDICAL_SERVICE_COMMITMENT'
//       },{
//         name:'医疗环境展示',
//         path: 'hospitalGuide/MEDICAL_ENVIRONMENT_DISPLAY'
//       },{
//         name:'医保公费专窗',
//         path: 'hospitalGuide/MEDICAL_INSURANCE_EXPENSE_WINDOW'
//       },{
//         name:'医院楼层分布及指示图',
//         path: 'hospitalGuide/FLOOR_LAYOUT_INDICATOR_DIAGRAM'
//       },{
//         name:'微博微信',
//         path: 'hospitalGuide/MICROBLOG_WECHAT'
//       }
//     ]
//   },
//   {
//     name:'栏目管理',
//     icon:'layout',
//     path:'columnManage'
//   },
//   {
//     name:'权限管理',
//     icon:'pie-chart',
//     submenu:[{
//         name:'身份权限',
//         path: 'authorityManagement'
//       },{
//         name:'用户管理',
//         path: 'authorityUser'
//       }]
//   },{
//     name:'信息管理',
//     icon:'pie-chart',
//     submenu:[{
//         name:'网站留言',
//         path: 'leaveMessage'
//       },{
//         name:'人才招聘处理',
//         path: 'authorityUser'
//       }]
//   },{
//     name:'医务志愿',
//     icon:'pie-chart',
//     submenu:[{
//         name:'科室介绍',
//         path: 'MedicalMattersEditor/ZH/UPDATE/NEW',
//       },{
//         name:'新闻动态',
//         path: 'MEDICAL_MATTERS/20',
//       },{
//         name:'社工服务',
//         path: 'MEDICAL_MATTERS_2',
//       },{
//         name:'科研教学',
//         path: 'MEDICAL_MATTERS_3',
//       },{
//         name:'公益慈善',
//         submenu: [{
//           name:'贫困患者救助项目',
//           path: 'MEDICAL_MATTERS_4'
//         },{
//           name:'申请流程',
//           path: 'MEDICAL_MATTERS_5'
//         }]
//       },{
//         name:'志愿服务',
//         submenu: [{
//           name:'服务队介绍',
//           path: 'MEDICAL_MATTERS_6'
//         },{
//           name:'服务项目介绍',
//           submenu: [{
//             name:'医务志愿恒常服务',
//             path: 'MEDICAL_MATTERS_7'
//           },{
//             name:'医务志愿专项服务',
//             path: 'MEDICAL_MATTERS_8'
//           }]
//         },{
//           name:'服务指南',
//           path: 'MEDICAL_MATTERS_9',
//         },{
//           name:'志愿分享',
//           path: 'MEDICAL_MATTERS_10',
//         },{
//           name:'加入我们',
//           path: 'MEDICAL_MATTERS_11',
//         }]
//       },{
//         name:'资料下载',
//         path: 'MEDICAL_MATTERS_12',
//       }]
//   }
// ]


// var data = {
//   "code": 200,
//   "msg": "OK",
//   "data": [
//     {
//       "id": 44,
//       "name": "资讯信息",
//       "sort": 1,
//       "path": "",
//       "submenu": [
//         {
//           "id": 48,
//           "name": "医院动态",
//           "sort": 0,
//           "path": "DYNAMIC",
//           "submenu": []
//         },
//         {
//           "id": 49,
//           "name": "医院公告",
//           "sort": 1,
//           "path": "NOTICE",
//           "submenu": []
//         },
//         {
//           "id": 50,
//           "name": "媒体报告",
//           "sort": 2,
//           "path": "REPORT",
//           "submenu": []
//         },
//         {
//           "id": 51,
//           "name": "学术动态",
//           "sort": 3,
//           "path": "SCIENCE",
//           "submenu": []
//         },
//         {
//           "id": 52,
//           "name": "党工团 建设",
//           "sort": 4,
//           "path": "PARTY",
//           "submenu": []
//         }
//       ]
//     },
//     {
//       "id": 53,
//       "name": "新媒体交互",
//       "sort": 5,
//       "path": "",
//       "submenu": [
//         {
//           "id": 54,
//           "name": "微信资讯",
//           "sort": 10,
//           "path": "WechatInfo",
//           "submenu": []
//         }
//       ]
//     },
//     {
//       "id": 55,
//       "name": "专题网站",
//       "sort": 7,
//       "path": "SpecialWebsite",
//       "submenu": []
//     },
//     {
//       "id": 56,
//       "name": "专题视频",
//       "sort": 8,
//       "path": "ThemeVideo",
//       "submenu": []
//     },
//     {
//       "id": 1,
//       "name": "医院概况",
//       "sort": 20,
//       "path": "",
//       "submenu": []
//     },
//     {
//       "id": 2,
//       "name": "科室导航",
//       "sort": 30,
//       "path": "",
//       "submenu": []
//     },
//     {
//       "id": 4,
//       "name": "专家信息",
//       "sort": 35,
//       "path": "expertInfo",
//       "submenu": []
//     },
//     {
//       "id": 5,
//       "name": "招聘招标",
//       "sort": 38,
//       "path": "",
//       "submenu": [
//         {
//           "id": 23,
//           "name": "人才招聘",
//           "sort": 1,
//           "path": "RECRUITMENT",
//           "submenu": [
//             {
//               "id": 46,
//               "name": "招聘启事",
//               "sort": 0,
//               "path": "recruitTips",
//               "submenu": []
//             },
//             {
//               "id": 47,
//               "name": "最新公告",
//               "sort": 1,
//               "path": "LIST",
//               "submenu": []
//             },
//             {
//               "id": 60,
//               "name": "表格下载",
//               "sort": 20,
//               "path": "UNKNOW",
//               "submenu": []
//             }
//           ]
//         },
//         {
//           "id": 24,
//           "name": "招标采购",
//           "sort": 2,
//           "path": "BIDDING",
//           "submenu": [
//             {
//               "id": 61,
//               "name": "采购公告",
//               "sort": 0,
//               "path": "",
//               "submenu": []
//             },
//             {
//               "id": 62,
//               "name": "结果公示",
//               "sort": 1,
//               "path": "",
//               "submenu": []
//             },
//             {
//               "id": 63,
//               "name": "网上竞价系统",
//               "sort": 2,
//               "path": "",
//               "submenu": []
//             },
//             {
//               "id": 64,
//               "name": "申购用户端登陆",
//               "sort": 3,
//               "path": "",
//               "submenu": []
//             },
//             {
//               "id": 65,
//               "name": "基建",
//               "sort": 4,
//               "path": "",
//               "submenu": []
//             },
//             {
//               "id": 66,
//               "name": "文件制度",
//               "sort": 5,
//               "path": "",
//               "submenu": []
//             },
//             {
//               "id": 67,
//               "name": "下载专区",
//               "sort": 6,
//               "path": "",
//               "submenu": []
//             }
//           ]
//         }
//       ]
//     },
//     {
//       "id": 6,
//       "name": "科研教学",
//       "sort": 50,
//       "path": "",
//       "submenu": [
//         {
//           "id": 25,
//           "name": "科学研究",
//           "sort": 1,
//           "path": "SCIENTIFIC_RESEARCH",
//           "submenu": []
//         },
//         {
//           "id": 26,
//           "name": "伦理委员会",
//           "sort": 2,
//           "path": "ETHICS_COMMITTEE",
//           "submenu": []
//         },
//         {
//           "id": 27,
//           "name": "研究生教育",
//           "sort": 3,
//           "path": "GRADUATE",
//           "submenu": []
//         },
//         {
//           "id": 28,
//           "name": "研究生招生",
//           "sort": 4,
//           "path": "GRADUATE_EDUCATION",
//           "submenu": []
//         },
//         {
//           "id": 29,
//           "name": "本科生教育",
//           "sort": 5,
//           "path": "UNDERGRADUATE",
//           "submenu": []
//         },
//         {
//           "id": 30,
//           "name": "继续教育",
//           "sort": 6,
//           "path": "CONTINUING",
//           "submenu": []
//         },
//         {
//           "id": 31,
//           "name": "进修生专区",
//           "sort": 7,
//           "path": "POSTGRADUATE",
//           "submenu": []
//         },
//         {
//           "id": 32,
//           "name": "下载专区",
//           "sort": 8,
//           "path": "DOWNLOAD",
//           "submenu": []
//         },
//         {
//           "id": 33,
//           "name": "相关链接",
//           "sort": 9,
//           "path": "RELATEDLINKS",
//           "submenu": []
//         },
//         {
//           "id": 34,
//           "name": "医院考试系统",
//           "sort": 12,
//           "path": "EXAMINATION",
//           "submenu": []
//         }
//       ]
//     },
//     {
//       "id": 7,
//       "name": "疾病科普",
//       "sort": 55,
//       "path": "scienceReader",
//       "submenu": []
//     },
//     {
//       "id": 77,
//       "name": "就医指南",
//       "sort": 60,
//       "path": "",
//       "submenu": []
//     },
//     {
//       "id": 3,
//       "name": "医务志愿",
//       "sort": 80,
//       "path": "",
//       "submenu": [
//         {
//           "id": 89,
//           "name": "新闻动态",
//           "sort": 10,
//           "path": "MEDICAL_MATTERS",
//           "submenu": []
//         },
//         {
//           "id": 90,
//           "name": "社工服务",
//           "sort": 20,
//           "path": "MEDICAL_MATTERS",
//           "submenu": []
//         },
//         {
//           "id": 91,
//           "name": "科研教学",
//           "sort": 30,
//           "path": "MEDICAL_MATTERS",
//           "submenu": []
//         },
//         {
//           "id": 92,
//           "name": "公益慈善",
//           "sort": 40,
//           "path": "",
//           "submenu": [
//             {
//               "id": 95,
//               "name": "贫困患者救助项目",
//               "sort": 10,
//               "path": "MEDICAL_MATTERS",
//               "submenu": []
//             },
//             {
//               "id": 96,
//               "name": "申请流程",
//               "sort": 20,
//               "path": "MEDICAL_MATTERS",
//               "submenu": []
//             }
//           ]
//         },
//         {
//           "id": 93,
//           "name": "志愿服务",
//           "sort": 50,
//           "path": "",
//           "submenu": [
//             {
//               "id": 97,
//               "name": "服务队介绍",
//               "sort": 10,
//               "path": "MEDICAL_MATTERS",
//               "submenu": []
//             },
//             {
//               "id": 98,
//               "name": "服务项目介绍",
//               "sort": 20,
//               "path": "",
//               "submenu": [
//                 {
//                   "id": 102,
//                   "name": "医务志愿恒常服务",
//                   "sort": 10,
//                   "path": "MEDICAL_MATTERS",
//                   "submenu": []
//                 },
//                 {
//                   "id": 103,
//                   "name": "医务志愿专项服务",
//                   "sort": 20,
//                   "path": "MEDICAL_MATTERS",
//                   "submenu": []
//                 }
//               ]
//             },
//             {
//               "id": 99,
//               "name": "服务指南",
//               "sort": 30,
//               "path": "MEDICAL_MATTERS",
//               "submenu": []
//             },
//             {
//               "id": 100,
//               "name": "志愿分享",
//               "sort": 40,
//               "path": "MEDICAL_MATTERS",
//               "submenu": []
//             },
//             {
//               "id": 101,
//               "name": "加入我们",
//               "sort": 50,
//               "path": "MEDICAL_MATTERS",
//               "submenu": []
//             }
//           ]
//         },
//         {
//           "id": 94,
//           "name": "资料下载",
//           "sort": 60,
//           "path": "MEDICAL_MATTERS",
//           "submenu": []
//         }
//       ]
//     },
//     {
//       "id": 104,
//       "name": "栏目管理",
//       "sort": 90,
//       "path": "columnManage",
//       "submenu": []
//     },
//     {
//       "id": 105,
//       "name": "权限管理",
//       "sort": 100,
//       "path": "",
//       "submenu": [
//         {
//           "id": 109,
//           "name": "身份权限",
//           "sort": 10,
//           "path": "authorityManagement",
//           "submenu": []
//         },
//         {
//           "id": 110,
//           "name": "用户管理",
//           "sort": 20,
//           "path": "authorityUser",
//           "submenu": []
//         },
//         {
//           "id": 111,
//           "name": "普通用户管理",
//           "sort": 30,
//           "path": "normalUser",
//           "submenu": []
//         }
//       ]
//     },
//     {
//       "id": 106,
//       "name": "信息管理",
//       "sort": 110,
//       "path": "",
//       "submenu": [
//         {
//           "id": 107,
//           "name": "网站留言",
//           "sort": 10,
//           "path": "leaveMessage",
//           "submenu": []
//         },
//         {
//           "id": 108,
//           "name": "人才招聘处理",
//           "sort": 20,
//           "path": "authorityUser",
//           "submenu": []
//         }
//       ]
//     }
//   ]
// }

// export default data.data 
// import axios from 'axios'
let data = []
// axios.get('http://192.168.0.122:7979/admin/navbar/openGetManagementHomeNavbar').then(res => {
//   if(res.data.code === 200) {
//     // data = res.data.data
//     // callback(res)
//   }
// })
// function callback(res) {
//   data = res.data.data
// }
export default data

