import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp();

const languageUtils = require("../../../language/languageUtils");
const db = wx.cloud.database();
const _ = db.command;
const lib = require('../../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {

    /**
     * Global data
     */
    openid: "",
    user: [],
    userInfo: {},
    isProjectEmpty: true,

    active: 0,
    pageName: ['Dashboard', 'More'],

    // 存放双语
    dictionary: {},
    language: 0,
    languageList: ["简体中文", "English"],

    /**
     * Message page's data
     */
    messageList: [],




    /**
     * Projects page's data
     */

    project: [],


    /**
     * Dashboard page's data
     */
    task:[],


    /**
     * More page's data
     */
    userInfo: {},

    currentTime: "",

    date: "",
    dateShow: false,
    filter: "",
    filterShow: true,
    choosePriority: "",
    priorityShow: false,

    changetip: '请输入新用户名',
    name : "",
    show: false,
    value: '', 

    Filter: ['Time', 'Priority'],

    totalTask: 0,
    updateIndex: 1,
  },

  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getData();

    // 初始化语言
    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan
    })

    // 载入时设置初始页面的navBar title
    wx.setNavigationBarTitle({
      title: this.data.pageName[this.data.active],
    })

    this.setData({
      identity: this.data.dictionary.house_owner,
      openid: options.openid,
      name : app.globalData.userInfo.nickName,
      userInfo: app.globalData.userInfo,
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton()

    var lan = wx.getStorageSync("languageVersion");
    this.initLanguage();
    this.setData({
      language: lan
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    return{
      title:'', //自定义标题
      path: '', //好友点击后跳转页面 
      desc: '', // 描述
      imageUrl: '' //分享的图片路径
    }
  },



  /**
   * Global method
   */


  // 初始化数据
  async getData(openid){

    

    await this.getInfo()

    await this.getProjectInfo(this.data.openid)
    

    for (var idx in this.data.project) {
      await this.updateState(this.data.project[idx]._id)
      await this.getTaskInfo(this.data.project[idx]._id)
      // console.log(this.data.project[idx])
    }
    
  },
  
  // 获取user信息
  getInfo() {
    return new Promise((resolve, reject) => {
      db.collection('user')
      .where({
        _openid: _.eq(this.data.openid)
      })
      .get()
      .then(res => {
        // console.log(res)
        this.setData({
          user: res.data[0]
        })
        resolve("成功获取用户数据");
      })
      .catch(err => {
        reject("请求用户信息失败")
      })  
    })
    
  },

  // 获取项目信息
  getProjectInfo(openid) {
    return new Promise((resolve, reject) => {
      db.collection('project')
      .where({
          houseOwner: _.eq(openid)
        })
      .get()
      .then(res => {
        console.log(res)
        if (res.data.length != 0) {
          this.setData({
            isProjectEmpty: false
          })
          for (var idx in res.data) {
            this.setData({
              project: this.data.project.concat(res.data[idx])
            })  
          }
        } 
        resolve("成功获取项目信息")
      })
      .catch(err => {
        reject("请求项目信息失败")
      })}
    )},

  // 获取任务信息
  getTaskInfo(projectId) {
    return new Promise((resolve, reject) => {
      db.collection('task')
      .where({
        belongTo: _.eq(projectId)
      })
      .get()
      .then(res => {
        // console.log(res)
        for (var idx in res.data) {
          this.setData({
            task: this.data.task.concat(res.data[idx])
          })
        }
        // this.data.task.push(res.data[0])
        resolve("成功获取任务信息")
      })
      .catch(err => {
        reject("请求任务信息失败")
      })
    })
  },

  // 更改tab选项时对应的逻辑
  onChangeTab(event) {
    this.setData({ active: event.detail });
    wx.setNavigationBarTitle({
      title: this.data.pageName[this.data.active],
    })
  },

  // 初始化语言
  initLanguage() {
    var self = this;
    //获取当前小程序语言版本所对应的字典变量
    var lang = languageUtils.languageVersion();

    // 页面显示
    self.setData({
      dictionary: lang.lang.index,
    });
  },

      
  /**
   * Dashboard page's method
   */
  clickTask(event) {
    wx.navigateTo({
      url: '../../project/taskInfoForHouseOwner/taskInfoForHouseOwner?id=' +  event.currentTarget.dataset.id,
    })
  },

  clickProjectReport(event) {
    // 如果项目为空，提示用户项目为空
    if (this.data.isProjectEmpty) {
      Toast(this.data.dictionary.no_project_error)
    } else {
      wx.navigateTo({
        url: '../../project/projectReport/projectReport?id=' + this.data.project[0]._id,
      })
    }
  },

  
  /**
   * More page's method
   */

  // 点击language展示选项
  onChangeLan(event) {
    // console.log('check')
    wx.navigateTo({
      url: '../../more/languageSetting/languageSetting',
    })
  },

  // 更新数据
  go_update(){
    this.setData({
      project: [],
      task: [],
    }),
    this.getData()
  },

  updateState(ID){

    const _currentTime = lib.formatDate(new Date());
    this.setData({
      currentTime: _currentTime
    });
    console.log(this.data.currentTime)

    db.collection('task')
      .where({
        belongTo: ID,
      })
      .count()
      .then(res => {
        this.setData({
          totalTask: res.total,
        })
        this.setData({
          updateIndex: this.data.totalTask / 20,
        })
        console.log(this.data.totalTask)
        console.log(parseInt(this.data.updateIndex))

        for(var i = 0; i <= parseInt(this.data.updateIndex); i++){
          db.collection('task')
          .skip(i*20)
          .get()
          .then(res => {
            //console.log(res)
            for (var idx in res.data) {
  
              if(res.data.state == 2 || res.data.state == 4){
                continue;
              }
  
              if(res.data[idx].startTime == ''){
                wx.cloud.callFunction({
                  name: 'updateState',
                  data: {
                    id: res.data[idx]._id,
                    state: 0
                  }
                })
                .then(res=>{
                  console.log('请求修改任务状态成功', res)
                })
                .catch(res => {
                  console.log('请求修改任务状态失败', res)
                })
              }else if(this.data.currentTime < res.data[idx].startTime){
                wx.cloud.callFunction({
                  name: 'updateState',
                  data: {
                    id: res.data[idx]._id,
                    state: 0
                  }
                })
                .then(res=>{
                  console.log('请求修改任务状态成功', res)
                })
                .catch(res => {
                  console.log('请求修改任务状态失败', res)
                })
  
              }else if(this.data.currentTime > res.data[idx].startTime && this.data.currentTime < res.data[idx].endTime){
                wx.cloud.callFunction({
                  name: 'updateState',
                  data: {
                    id: res.data[idx]._id,
                    state: 1
                  }
                })
                .then(res=>{
                  console.log('请求修改任务状态成功', res)
                })
                .catch(res => {
                  console.log('请求修改任务状态失败', res)
                })
              }else if(this.data.currentTime > res.data[idx].endTime){
                wx.cloud.callFunction({
                  name: 'updateState',
                  data: {
                    id: res.data[idx]._id,
                    state: 3
                  }
                })
                .then(res=>{
                  console.log('请求修改任务状态成功', res)
                })
                .catch(res => {
                  console.log('请求修改任务状态失败', res)
                })
              }
  
            }
            // this.data.task.push(res.data[0])
          })
        }

        console.log("成功获取任务信息")
      })
      .catch(err => {
        console.log("请求任务信息失败")
      })

      

  },

  clickFilter() {
    if (this.data.isProjectEmpty) {
      Toast({
        message: this.data.dictionary.no_project_error,
      })
    } else {
      this.setData({
        filterShow: false
      })
    }
    
  },

  onFilterClose() {
    this.setData({filterShow: false})
  },

  onFilterSelect(e) {
    this.setData({
      filterShow: !this.data.filterShow,
      filter: e.currentTarget.dataset.name
    })
    if(this.data.filter == 'Time'){
      this.onTimeSelect()
    }
    else if(this.data.filter == 'Priority'){
      this.onPrioritySelect()
    }
  },

  
  // formatDate(date) {
  //   date = new Date(date);
  //   return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  // },
  onTimeSelect() {
    this.setData({
      task: [],
    });
    for (var idx in this.data.project) {
      this.timeFilter(this.data.project[idx]._id)
    }
  },

  timeFilter(projectId){
    return new Promise((resolve, reject) => {
      db.collection('task')
      .where({
        belongTo: _.eq(projectId),
      })
      .orderBy("endTime", 'asc')
      .get()
      .then(res => {
        // console.log(res)
        for (var idx in res.data) {
          this.setData({
            task: this.data.task.concat(res.data[idx])
          })
        }
        // this.data.task.push(res.data[0])
        resolve("成功获取任务信息")
      })
      .catch(err => {
        reject("请求任务信息失败")
      })
    })
  },


  onPrioritySelect() {
    this.setData({
      task: [],
    })

    for (var idx in this.data.project) {
      this.priorityFilter(this.data.project[idx]._id)
    }
  },

  priorityFilter(projectId){
    new Promise((resolve, reject) => {
    db.collection('task')
      .where({
        belongTo: _.eq(projectId),
        //currentPriority: _.eq('Highest')
      })
      .get()
      .then(res => {
        for (var idx in res.data) {
          if(res.data[idx].currentPriority == "Highest"){
            this.setData({
              task: this.data.task.concat(res.data[idx])
            })
          } 
        }
        for (var idx in res.data) {
          if(res.data[idx].currentPriority == "High"){
            this.setData({
              task: this.data.task.concat(res.data[idx])
            })
          } 
        }
        for (var idx in res.data) {
          if(res.data[idx].currentPriority == "Normal"){
            this.setData({
              task: this.data.task.concat(res.data[idx])
            })
          } 
        }
        for (var idx in res.data) {
          if(res.data[idx].currentPriority == "Low"){
            this.setData({
              task: this.data.task.concat(res.data[idx])
            })
          } 
        }
        for (var idx in res.data) {
          if(res.data[idx].currentPriority == "Lowest"){
            this.setData({
              task: this.data.task.concat(res.data[idx])
            })
          } 
        }
        resolve("成功获取任务信息")
      })
      .catch(err => {
        reject("请求任务信息失败")
      })
    })
  },

  userNameInput:function(e){
    this.setData({
      value:e.detail.value
    })
  },

  forNotice: function (e) {
    let value= this.data.value;
    if (value=='') {
      Toast.fail('空用户名');
    } else {
      Toast({
        type: 'success',
        message: '提交成功',
        onClose: () => {
           this.setData({ 
             show: false,
             value: '',
          });
          //console.log('执行OnClose函数');
        },
      }); 
    }
  },
    
  listenerActionSheet: function() {
    this.setData({
      //取反
        filterShow: !this.data.filterShow
    });
  }
})