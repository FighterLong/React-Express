/*
 * @Author: kaiback__zgt_1430666237@qq.com 
 * @Date: 2018-05-10 14:55:22 
 * @Last Modified by: kaiback__zgt_1430666237@qq.com
 * @Last Modified time: 2018-06-26 09:59:19
 */
// 测试编辑器

import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import testEditor from 'view/testEditor'
// import HospitalInfo from 'view/information/hospital-info'
import HospitalDynamic from 'view/information/hospital-dynamic'
// 医务志愿
import MedicalMattersEditor from 'view/medical_matters/medical_matters_editor'
import MedicalDsc from 'view/medical_matters/medicalDesc'
// import Login from 'view/login/index.js'
// import MediaReport from 'view/information/media-report'
// import Learning from 'view/information/learning'
// import PartyBuild from 'view/information/party-build'
import InformationEdit from 'view/information/edit'

// 新媒体交互 微信资讯
import WechatInfo from 'view/new-media/wechat-info'
import WechatInfoEditor from 'view/new-media/wechat-info-editor'


import ThemeVideo from 'view/theme-video/theme-video'
import ThemeVideoEditor from 'view/theme-video/theme-video-editor'
// 重点科室
import KeyDepart from 'view/department'
import KeyDepartBrief from 'view/department/key-depart-brief'
import SonDepart from 'view/department/son-depart.js'
import SonDepartBrief from 'view/department/son-depart-brief.js'

// 专家信息
import expertInfo from 'view/expert-info/expert-info'
import expertInfoEditor from 'view/expert-info/expert-info-editot'
// 就医指南
import hospitalGuide from 'view/hospital-guide/hospital-guide'
import hospitalGuideEditor from 'view/hospital-guide/hospital-guide-editor'

// 疾病科普
import scienceReader from 'view/science-reader/science-reader.js'
import scienceReaderEditor from 'view/science-reader/science-reader-editor.js'
// 招聘启示
import recruitTips from 'view/recruit-tips/recruit-tips.js'
import RecruitEditor from 'view/recruit-tips/recruit-tips-editor.js'
import RecruitArticleEditor from 'view/recruit-tips/recruit-article-editor.js'


// 栏目管理
import ColumnManage from 'view/column'

// 专题网站
import SpecialWebsite from 'view/special-website/special-website'
import SpecialWebsiteEditor from 'view/special-website/special-website-editor'
import SpecialWebsitePage from 'view/special-website/special-website-page'

//院训
import HospitalTraining from 'view/hospital-training/hospital-training.js'
import UpdateHospitalTraining from 'view/hospital-training/updateHospitalTraining.js'

// 权限管理  身份管理
import authorityManagement from 'view/authority-management/authority-management.js'
import authorityUser from 'view/authority-management/authority-user.js'
import ordinaryUser from 'view/authority-management/ordinary-user.js'


// 信息管理 网站留言
import leaveMessage from 'view/information-management/leave-message.js'
import leaveMessageEditor from 'view/information-management/leave-message-editor.js'
import Talents from 'view/information-management/talents-invite.js'
import TalentsEditor from 'view/information-management/talents-editor.js'

import Layout from 'view/layout/demo.js'
import ErrorURL from 'view/layout/child/error.js'

// 科研教学
import Research from 'view/party/party.js'
import ResearchEditor from 'view/party/party-editor.js'

// 日志记录
import LoginLog from 'view/operation-log/loginIn-log.js'
import OperationLog from 'view/operation-log/operation-log.js'
import Message from 'view/operation-log/message.js'

// 首页信息
import homePage from 'view/home-page/home-page.js'
import Footer from 'view/home-page/footer.js'
import TopImage from 'view/home-page/top-image.js'
import Login from '../view/login';

// 默认页
import defaultPage from 'view/defaultPage/defaultPage.js'

// const data = ColumnManage()
// console.log(data)

export default class CRouter extends Component {
  render () {
    // 就医指南对应页面type
    let hospitalGuideUrl = []
    let hospitalGuideUrl2 = []
    const hospitalGuideList = ['EMERGRNCY_TREATMENT_GUIDE','OUTPATIENT_SERVICE_GUIDE','HOSPITALIZATION_GUIDE','TRANSPORTATION_GUIDE',
    'APPOINTMENT_MODE','ADVANCED_TECHNOLOGY_EQUIPMENT','MEDICAL_SERVICE_COMMITMENT','MEDICAL_ENVIRONMENT_DISPLAY','MEDICAL_INSURANCE_EXPENSE_WINDOW',
    'FLOOR_LAYOUT_INDICATOR_DIAGRAM','MICROBLOG_WECHAT']
    // 咨询模块的Router URL
    let hospitalDynamicURL = []
    // let hospitalDynamicEditorURL = []
    const hospitalDynamicURLList = ['/NOTICE','/REPORT','/SCIENCE','/PARTY','/MEDICAL_MATTERS/:id']
    
    // 招聘招标人才招聘
    const RCzhaopin = ['/recruitTips/:id','/LIST/:id','/UNKNOW/:id','/BIDDING/:id']
    let arrRC = []
    // let updateArrRc = []
    // 科室
    return (
      <Switch>
        {/* 资讯信息 */}
        
        {/* <Route path="/HospitalInfo" component={HospitalInfo} />
        <Route path="/HospitalDynamic" component={HospitalDynamic} />
        <Route path="/MediaReport" component={MediaReport} />
        <Route path="/Learning" component={Learning} />
        <Route path="/PartyBuild" component={PartyBuild} />
        <Route path="/Information/:lang/:from/:id" component={InformationEdit} /> */}
        {/* 测试编辑器 testEditor */}
        <Route path={"/testEditor"} component={testEditor} />
        <Route path={"/Information/:lang/:from/:id"} component={InformationEdit} />
        <Route path={"/DYNAMIC"} component={HospitalDynamic}  />
        {
          hospitalDynamicURLList.forEach(function(item){
            hospitalDynamicURL.push(<Route   path={item} component={HospitalDynamic} key={item} />)
            // hospitalDynamicEditorURL.push()
          })
        }
        {hospitalDynamicURL}
        {/* {hospitalDynamicEditorURL} */}


        {/* 微信资讯 */}
        <Route path="/WechatInfo" component={WechatInfo} />
        <Route path="/WechatInfoEditor/:id" component={WechatInfoEditor} />
        {/* 医务志愿 */}
        <Route path="/MedicalMattersEditor/:lang/:from/:id" component={MedicalMattersEditor}/>
        <Route path="/MedicalDsc/:navId" component={MedicalDsc}/>
        {/* 专题视频 */}
        <Route path="/ThemeVideo" component={ThemeVideo} key="sssssss" />
        <Route path="/ThemeVideoUpdate/:id" component={ThemeVideoEditor} key="xxxxxxxxxx"/>
        {/* 招标招聘 */}
        {
          RCzhaopin.forEach(item=>{
            arrRC.push( <Route   path={item} component={recruitTips} key={item}></Route>)
          })
        }
        
        {arrRC}
        {/* <Route   path='/BIDDING' component={recruitTips} key={'BIDDING'}></Route> */}
        <Route  path='/recruitTipsUpdate/:navId/:id' component={RecruitEditor}></Route>
        <Route  path='/RecruitArticleEditor/:navId/:id' component={RecruitArticleEditor}></Route>
        
        {/* 重点科室 */}
        <Route  path="/keyDepart/:id/" component={KeyDepart} key="@x52"/>
        <Route  path="/keyDepartSoon/:id/" component={KeyDepart} key="@x2"/>
        <Route  path="/keyDepartUpdate/:id/:navId" component={KeyDepartBrief} key="@x51"/>
        <Route  path="/keyDepartSoonUpdate/:id" component={KeyDepartBrief} key="@x51"/>
        {/* 科室>>>子网站 */}
        <Route  path="/SonDepart/:id/:type" component={SonDepart}/>
        <Route  path="/SonDepartBrief/:id/:type" component={SonDepartBrief}/>


        {/* <Route    path="/keyDepart/:id/brief/:type" component={KeyDepartBrief} /> */}
        
        <Route  path='/expertInfo' component={expertInfo}></Route>
        <Route  path='/expertInfoUpdate/:id' component={expertInfoEditor}></Route>
        
        
        {/* 就医指南 */}
        {
          hospitalGuideList.forEach(function(item){
            hospitalGuideUrl.push(<Route   path={'/hospitalGuide/'+item} component={hospitalGuide} key={item}></Route>)
            hospitalGuideUrl2.push(<Route path={'/hospitalGuideUpdate/'+item+'/:type/:id'} component={hospitalGuideEditor} key={item+'_editor'}></Route>)
          })
        }
        {hospitalGuideUrl}
        {hospitalGuideUrl2}
        {/* 急诊 */}
        {/* <Route   path='/hospitalGuide/emergency' component={hospitalGuide} key="emergency"></Route>
        <Route path='/hospitalGuide/emergency/:id' component={hospitalGuideEditor} key="emergency_editor"></Route> */}
        {/* 门诊 */}
        {/* <Route path='/hospitalGuide/outpatient' component={hospitalGuide} key="outpatient"></Route>
        <Route path='/hospitalGuide/outpatient/:id' component={hospitalGuideEditor} key="outpatient_editor"></Route> */}





        {/* 疾病科普 */}
        <Route path='/scienceReader' component={scienceReader}></Route>
        <Route path='/scienceReaderUpdate/:id' component={scienceReaderEditor}></Route>
        {/* 栏目管理 */}
        <Route path='/columnManage' component={ColumnManage}></Route>

        {/*医院概况 */}
        <Route path='/HospitalTraining/:id' component={HospitalTraining}></Route>
        {/* HospitalTraining/update/:id */}
        
        {/* <Route    path='/SpecialWebsites' component={UpdateHospitalTraining}></Route> */}
        <Route path='/HospitalTrainingUpdate/:id' component={UpdateHospitalTraining}></Route>

        {/* 专题网站 */}
        <Route path='/SpecialWebsite/:type' component={SpecialWebsite}></Route>
        <Route path='/SpecialWebsitePage/:type' component={SpecialWebsitePage}></Route>
        <Route path='/SpecialWebsiteUpdate/:id/:type' component={SpecialWebsiteEditor}></Route>
        
        {/* 权限管理 */}
        <Route path='/authorityManagement' component={authorityManagement}></Route>
        <Route path='/authorityUser' component={authorityUser}></Route>
        <Route path='/ordinaryUser' component={ordinaryUser}></Route>
        
        
        {/* 网站留言 */}
        <Route path='/leaveMessage' component={leaveMessage}></Route>
        <Route path='/leaveMessageEditor/:id' component={leaveMessageEditor}></Route>
        <Route path='/Talents' component={Talents}></Route>
        <Route path='/TalentsEditor/:id' component={TalentsEditor}></Route>
        

        {/* 首页信息 */}
        <Route path='/homePage' component={homePage}></Route>
        <Route path='/Footer' component={Footer}></Route>
        <Route path='/TopImage' component={TopImage}></Route>
        
        {/* 登陆 */}
        <Route path='/Login' component={Login}></Route>
        <Route path='/Layout' component={Layout}></Route>
        <Route path='/ErrorURL' component={ErrorURL}></Route>
        
        {/* 科研教学 */}
        <Route path='/teachingProject/:id' component={Research} key="teachingProject"></Route>
        <Route path='/teachingEditor/:navId/:id' component={ResearchEditor}  key="teachingEditor"></Route>

        <Route path='/ResearchProject/:id' component={Research}  key="ResearchProject"></Route>
        <Route path='/ResearchEditor/:navId/:id' component={ResearchEditor} key="ResearchEditor"></Route>
        
        {/* 操作日志 */}
        <Route path='/LoginLog' component={LoginLog}></Route>
        <Route path='/OperationLog' component={OperationLog}></Route>
        <Route path='/Message/:id' component={Message}></Route>
        
        {/* 默认页 */}
        <Route path='/defaultPage' component={defaultPage}></Route>

        <Redirect path="/" to={{pathname: '/Login'}} />
      </Switch>
    )
  }
}