import React,{ Component } from 'react';
import { Input, Button, Table, Select, Form, Divider,message} from 'antd';
// import api from '@/api/index.js'
// import {timeFillter} from '../../common/js/public.js'

import './talents-styl.styl'
// import { spawn } from 'child_process';
import axios from 'axios';
import {URL} from '@/common/js/url.js'

import img from '@/common/imgs/icon_mail.png'
import img2 from "@/common/imgs/icon_environment.png"
import img3 from "@/common/imgs/icon_mobile.png"
// const URL = 'http://192.168.0.122:7979'
const Option = Select.Option
const { TextArea } = Input;
function filterTime(time) {
    if(!time){
        return ''
    }
    let d = new Date(time);
    let year = d.getFullYear();
    let month = d.getMonth() + 1
    let day = d.getDate()
    return `${year}-${month}-${day}`
}

class TalentsEditor extends Component{
  /********************************* 其他操作 end *******************************/
  state = {
    data: {},
    params: {}
  }
  componentDidMount() {
      this.getInfo()
  }

  getInfo = () => {
    axios.get(`${URL}/admin/employmentApplication/retrieveOne?id=${this.props.match.params.id}`).then(res => {
      if(res.data.code === 200) {
        this.setState({data: res.data.data.form,params: res.data.data})
      }
    })
  }

  // 保存审核结果
  saveData = () => {
    axios.post(`${URL}/admin/employmentApplication/auditApplication`,this.state.params).then(res => {
      if(res.data.code === 200) {
        message.success('保存成功！')
      }else{
        message.error(res.data.msg)
      }
    }).catch(err => {
      message.error('异常请求')
    })
  }

  // 返回
  goBack = () => {
    window.history.back(-1)
  }

  // 描述双向绑定
  setData = (e) => {
    this.setState({params: {...this.state.params,[e.target.name]: e.target.value}})
  }
  
  render(){
    let learningExperience = []// 学历
    let workExperienceList = []// 工作经历
    let reprReseFundList = []// 代表性科研基金
    let reprReseArticleList = []// 代表性科研文章
    let practiceExperienceList = []
    return (
        <div>
        <div className="recruitInterview">
          <div className="interviewHead">
            <img className="headerImg" src={this.state.data.iconUrl} alt=""/>
            <div className="headerContent">
              <p className="name">{this.state.data.applicantName}</p>
              <p className="others"> {this.state.data.sex} | {filterTime(this.state.data.birthDate)/*this.state.data.birthDate*/} | {this.state.data.nationality} | {this.state.data.nation} | {this.state.data.politicsStatus }</p>
              <p className="others"><img src={img} alt=""/><span>&nbsp;{this.state.data.commonEmail}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><img src={img3} alt=""/><span>&nbsp;{this.state.data.cellPhoneNumbers}</span></p>
              <p className="others"><img src={img2} alt=""/><span>&nbsp;{this.state.data.address}&nbsp;&nbsp;&nbsp;{this.state.data.postCode}</span></p>
            </div>
          </div>
          <div className="interviewJob">
            <p className="title">求职意向</p>
            <div className="jobContent">
              <div style={{flex: 1}}>
                <p className="contentTitle">应聘岗位</p>
                <p className="contentIndex">{this.state.data.post}</p>
              </div>
              <div style={{flex: 1}}>
                <p className="contentTitle">应聘科室</p>
                <p className="contentIndex">{this.state.data.department}</p>
              </div>
              <div style={{flex: 2}}></div>
            </div>
          </div>
          <div className="interviewInformation">
            <p className="title">个人信息</p>
            <div className="informationContent" style={{borderBottom: '1px dotted #dedede'}}>
              <div style={{flex: 1}}>
                <p className="contentTitle">{this.state.data.nationality === '中国' ? '身份证号' : '护照号'}</p>
                <p className="contentIndex">{this.state.data.idCardNo}</p>
              </div>
              <div style={{flex: 1}}>
                <p className="contentTitle">籍贯</p>
                <p className="contentIndex">{this.state.data.birthplace}</p>
              </div>
              <div style={{flex: 1}}>
                <p className="contentTitle">婚姻状况</p>
                <p className="contentIndex">{this.state.data.maritalStatus}</p>
              </div>
              <div style={{flex: 1}}>
                <p className="contentTitle">健康状况</p>
                <p className="contentIndex">{this.state.data.healthStatus}</p>
              </div>
            </div>
            <div style={{borderBottom: '1px dotted #dedede'}}>
              <div className="informationContent">
                <div style={{flex: 1}}>
                  <p className="contentTitle">最高学历</p>
                  <p className="contentIndex">{this.state.data.highestEducation}</p>
                </div>
                <div style={{flex: 1}}>
                  <p className="contentTitle">最高学位</p>
                  <p className="contentIndex">{this.state.data.highestDegree}</p>
                </div>
                <div style={{flex: 2}}>
                  <p className="contentTitle">身高</p>
                  <p className="contentIndex">{this.state.data.height}</p>
                </div>
              </div>
              <div className="informationContent" style={{marginTop:  0}}>
                <div style={{flex: 1}}>
                  <p className="contentTitle">毕业时间</p>
                  <p className="contentIndex">{filterTime(this.state.data.graduationTime)}</p>
                </div>
                <div style={{flex: 1}}>
                  <p className="contentTitle">最高学历毕业院校</p>
                  <p className="contentIndex">{this.state.data.highestEducationSchool}</p>
                </div>
                <div style={{flex: 1}}>
                  <p className="contentTitle">最高学历专业</p>
                  <p className="contentIndex">{this.state.data.highestEducationMajor}</p>
                </div>
                <div style={{flex: 1}}></div>
              </div>
            </div>
            <div className="informationContent" style={{borderBottom: '1px dotted #dedede'}}>
              <div style={{flex: 1}}>
                <p className="contentTitle">是否参加过工作/培训</p>
                <p className="contentIndex">{this.state.data.workTrainingTimePeriod?'是': '否'}</p>
              </div>
              <div style={{flex: 1}}>
                <p className="contentTitle">参加工作/培训时间</p>
                <p className="contentIndex">{this.state.data.workTrainingTimePeriod}</p>
              </div>
              <div style={{flex: 1}}>
                <p className="contentTitle">现工作单位/科室/岗位</p>
                <p className="contentIndex">{this.state.data.currentWorkingUintDeptPost}</p>
              </div>
              <div style={{flex: 1}}></div>
            </div>
            <div style={{borderBottom: '1px dotted #dedede'}}>
              <div className="informationContent">
                <div style={{flex: 1}}>
                  <p className="contentTitle">外语水平</p>
                  <p className="contentIndex">{this.state.data.foreignLanguageLevel}</p>
                </div>
                <div style={{flex: 1}}>
                  <p className="contentTitle">计算机水平</p>
                  <p className="contentIndex">{this.state.data.computerLevel}</p>
                </div>
                <div style={{flex: 1}}>
                  <p className="contentTitle">职业资格证</p>
                  <p className="contentIndex">{this.state.data.hasProfQualCert}</p>
                </div>
                <div style={{flex: 1}}></div>
              </div>
              <div className="informationContent" style={{marginTop:  0}}>
                <div style={{flex: 1}}>
                  <p className="contentTitle">专业技术资格</p>
                  <p className="contentIndex">{this.state.data.profTechCert}</p>
                </div>
                <div style={{flex: 1}}>
                  <p className="contentTitle">资格取得时间</p>
                  <p className="contentIndex">{filterTime(this.state.data.profTechCertTime)}</p>
                </div>
                <div style={{flex: 1}}>
                </div>
                <div style={{flex: 1}}>
                </div>
              </div>
            </div>
          </div>
          <div className="interviewStudy">
            <p className="title">学习经历（高中起）</p>
            {(this.state.data.learningExperienceList ? this.state.data.learningExperienceList:[]).forEach((item,index)=>{
                 learningExperience.push(<div style={{borderBottom: index === this.state.data.learningExperienceList.length-1?'':'1px dashed #dedede'}}>
                    <div className="studyContent">
                    <div style={{flex: 1}}>
                        <p className="contentTitle">就读时间</p>
                        <p className="contentIndex">{filterTime(item.startTime )}</p>
                    </div>
                    <div style={{flex: 1}}>
                        <p className="contentTitle">学校</p>
                        <p className="contentIndex">{item.school}</p>
                    </div>
                    <div style={{flex: 1}}>
                        <p className="contentTitle">专业</p>
                        <p className="contentIndex">{item.major}</p>
                    </div>
                    <div style={{flex: 1}}>
                        <p className="contentTitle">学历（学位）</p>
                        <p className="contentIndex">{item.degree}</p>
                    </div>
                    </div>
                    <div className="studyContent" style={{marginTop:  0}}>
                    <div style={{flex: 1}}>
                        <p className="contentTitle">学制（年）</p>
                        <p className="contentIndex">{item.educationalSystem}</p>
                    </div>
                    <div style={{flex: 1}}>
                        <p className="contentTitle">专业类型</p>
                        <p className="contentIndex">{item.majorType}</p>
                    </div>
                    <div style={{flex: 1}}>
                        <p className="contentTitle">导师姓名</p>
                        <p className="contentIndex">{item.tutor}</p>
                    </div>
                    <div style={{flex: 1}}>
                        <p className="contentTitle">学习形式</p>
                        <p className="contentIndex">{item.studyMode}</p>
                    </div>
                    </div>
                </div>)
            })}
            {learningExperience}
          </div>

          <div className="interviewWorking">
            <p className="title">实习经历</p>
            {(this.state.data.practiceExperienceList?this.state.data.practiceExperienceList: []).forEach(((item,index )=> {
                practiceExperienceList.push(<div style={{borderBottom: index === this.state.data.practiceExperienceList.length-1?'':'1px dashed #dedede'}}>
                <div className="workingContent">
                  <div style={{flex: 1}}>
                    <p className="contentTitle">在职时间</p>
                    <p className="contentIndex">{filterTime(item.startTime)}</p>
                  </div>
                  <div style={{flex: 1}}>
                    <p className="contentTitle">工作单位</p>
                    <p className="contentIndex">{item.workUnit}</p>
                  </div>
                  <div style={{flex: 2}}>
                    <p className="contentTitle">是否为三甲医院</p>
                    {
                      item.workUnit ?<p className="contentIndex">{item.topThreeHospital ? '是' : '否'}</p>: null
                    }
                  </div>
                </div>
                <div className="workingContent" style={{marginTop:  0}}>
                  <div style={{flex: 1}}>
                    <p className="contentTitle">所属部门（科室）</p>
                    <p className="contentIndex">{item.fromDepartment}</p>
                  </div>
                  <div style={{flex: 1}}>
                    <p className="contentTitle">岗位</p>
                    <p className="contentIndex">{item.post}</p>
                  </div>
                  <div style={{flex: 1}}>
                    <p className="contentTitle">专业技术职务</p>
                    <p className="contentIndex">{item.professionalTechnicalPost}</p>
                  </div>
                  <div style={{flex: 1}}></div>
                </div>
              </div>)
            }))}
            {practiceExperienceList}
          </div>

          

          <div className="interviewWorking">
            <p className="title">工作经历</p>
            {(this.state.data.workExperienceList?this.state.data.workExperienceList: []).forEach(((item,index )=> {
                workExperienceList.push(<div style={{borderBottom: index === this.state.data.workExperienceList.length-1?'':'1px dashed #dedede'}}>
                <div className="workingContent">
                  <div style={{flex: 1}}>
                    <p className="contentTitle">在职时间</p>
                    <p className="contentIndex">{filterTime(item.startTime)}</p>
                  </div>
                  <div style={{flex: 1}}>
                    <p className="contentTitle">工作单位</p>
                    <p className="contentIndex">{item.workUnit}</p>
                  </div>
                  <div style={{flex: 2}}>
                    <p className="contentTitle">是否为三甲医院</p>
                    {
                      item.workUnit ?<p className="contentIndex">{item.topThreeHospital ? '是' : '否'}</p>: null
                    }
                    
                  </div>
                </div>
                <div className="workingContent" style={{marginTop:  0}}>
                  <div style={{flex: 1}}>
                    <p className="contentTitle">所属部门（科室）</p>
                    <p className="contentIndex">{item.fromDepartment}</p>
                  </div>
                  <div style={{flex: 1}}>
                    <p className="contentTitle">岗位</p>
                    <p className="contentIndex">{item.post}</p>
                  </div>
                  <div style={{flex: 1}}>
                    <p className="contentTitle">专业技术职务</p>
                    <p className="contentIndex">{item.professionalTechnicalPost}</p>
                  </div>
                  <div style={{flex: 1}}></div>
                </div>
              </div>)
            }))}
            {workExperienceList}
          </div>
          <div className="interviewPublish">
            <p className="title">奖惩情况</p>
            <div className="publishContent">{this.state.data.rewardsAndPunishment?this.state.data.rewardsAndPunishment: '无'}</div>
          </div>
          <div className="interviewFund">
            <p className="title">代表性科研基金</p>
            {(this.state.data.reprReseFundList?this.state.data.reprReseFundList:[]).forEach((item,index) => {
                reprReseFundList.push(<div style={{borderBottom: "1px dotted #dedede"}} >
                <div className="fundContent">
                  <div style={{flex: 1}}>
                    <p className="contentTitle">项目名称</p>
                    <p className="contentIndex">{item.projectName}</p>
                  </div>
                  <div style={{flex:  3}}></div>
                </div>
                <div className="fundContent" style={{marginTop:  0}}>
                  <div style={{flex: 1}}>
                    <p className="contentTitle">批准年月</p>
                    <p className="contentIndex">{filterTime(parseInt(item.approvedTime))}</p>
                  </div>
                  <div style={{flex: 1}}>
                    <p className="contentTitle">级别</p>
                    <p className="contentIndex">{item.level}</p>
                  </div>
                  <div style={{flex: 1}}>
                    <p className="contentTitle">经费</p>
                    <p className="contentIndex">{item.expenditure}</p>
                  </div>
                  <div style={{flex: 1}}>
                    <p className="contentTitle">排名</p>
                    <p className="contentIndex">{item.ranking}</p>
                  </div>
                </div>
                <div className="fundContent" style={{marginTop:  0}}>
                  <div style={{flex: 1}}>
                    <p className="contentTitle">备注</p>
                    <p className="contentIndex">{item.remark}</p>
                  </div>
                </div>
              </div>)
            })}
            {reprReseFundList}
          </div>
          <div className="interviewArticle">
            <p className="title">代表性科研文章</p>
            {(this.state.data.reprReseArticleList?this.state.data.reprReseArticleList:[]).forEach((item,index) => {
                reprReseArticleList.push(<div style={{borderBottom: '1px dotted #dedede'}} key="index">
                <div className="articleContent">
                  <div style={{flex: 1}}>
                    <p className="contentTitle">杂志名称</p>
                    <p className="contentIndex">{item.magazineName}</p>
                  </div>
                  <div style={{flex: 1}}>
                    <p className="contentTitle">类型</p>
                    <p className="contentIndex">{item.category}</p>
                  </div>
                </div>
                <div className="articleContent">
                  <div style={{flex: 1}}>
                    <p className="contentTitle">论文题目</p>
                    <p className="contentIndex">{item.paperTitle}</p>
                  </div>
                </div>
                <div className="articleContent">
                  <div style={{flex: 1}}>
                    <p className="contentTitle">发表年月</p>
                    <p className="contentIndex">{filterTime(parseInt(item.publishTime))}</p>
                  </div>
                  <div style={{flex: 1}}>
                    <p className="contentTitle">影响因子</p>
                    <p className="contentIndex">{item.impactFactor}</p>
                  </div>
                  <div style={{flex: 1}}>
                    <p className="contentTitle">排名</p>
                    <p className="contentIndex">{item.ranking}</p>
                  </div>
                  <div style={{flex: 1}}>
                    <p className="contentTitle">发表情况</p>
                    <p className="contentIndex">{item.publishStatus}</p>
                  </div>
                </div>
              </div>)
            })}
            {reprReseArticleList}
          </div>
          <div className="interviewOther">
            <p className="title">其他说明</p>
            <div className="otherContent">{this.state.data.otherInstructions}</div>
          </div>
          <div className="interviewFoot">
            <p className="title">是否服从单位调剂</p>
            <div className="footContent">{this.state.data.subjectToadjust ? '是' : '否'}</div>
          </div>
        </div>
        <div className="rightMenu">
            <p>资格审查结果：</p>
            <Select value={this.state.params.qualificationResult} onChange={(value)=>{
              if (value !== '通过') {
                this.setState({params: {...this.state.params,qualificationResult: value, admissionResult: '', admiResuDesc: ''}})
              } else {
                this.setState({params: {...this.state.params,qualificationResult: value}})
              }
            }} style={{width: '200px',marginBottom: '20px'}}
              getPopupContainer={triggerNode => triggerNode.parentNode}>
                <Option value="待定">待定</Option>
                <Option value="通过">通过</Option>
                <Option value="不通过">不通过</Option>
            </Select>
            <p>资格审查结果描述：</p>
            <TextArea name="qualResuDesc" maxLength={200}  value={this.state.params.qualResuDesc} rows={4} onChange={this.setData} style={{marginBottom: '20px'}}/>
            <p>录取结果：</p>
            <Select disabled={this.state.params.qualificationResult!=='通过'} value={this.state.params.admissionResult} onChange={(value)=>{this.setState({params: {...this.state.params,admissionResult: value}})}} style={{width: '200px',marginBottom: '20px'}}
              getPopupContainer={triggerNode => triggerNode.parentNode}>
                <Option value="待定">待定</Option>
                <Option value="录取">录取</Option>
                <Option value="未录取">未录取</Option>
            </Select>
            <p>录取结果描述：</p>
            <TextArea name="admiResuDesc" maxLength={200} value={this.state.params.admiResuDesc} onChange={this.setData} disabled={this.state.params.qualificationResult!=='通过'} rows={4} style={{marginBottom: '20px'}}/>
            <Button type="primary" style={{marginRight: '20px'}} onClick={this.saveData}>确认</Button>
            <Button onClick={this.goBack}>返回</Button>
        </div>
      </div>
    );
  }
}

export default TalentsEditor;
