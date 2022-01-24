Page({

  /**
   * 页面的初始数据
   */
  data: {

    /**
     * Global data
     */
    active: 2,
    pageName: ['Message', 'Project', 'Dashboard', 'More'],



    /**
     * Message page's data
     */
    messageList: [{
      sender: 'Loc',
      timeStamp: '2022-1-16',
      content: 'Hello world',
    },{
      sender: 'Zack',
      timeStamp: '2022-1-08',
      content: 'Hi',
    },{
      sender: 'Christina',
      timeStamp: '2022-1-11',
      content: 'Hello',
    }
    ],




    /**
     * Projects page's data
     */

    project: [{
      name: "project1"
    },{
      name: "project2"
    },{
      name: "project3"
    },{
      name: "project4"
    }],


    /**
     * Dashboard page's data
     */
    taskList:[{
      name: "task1",
      // not start
      state: 0,
      startTime: "2022-2-12",
      endTime: "2022-2-24"
    },{
      name: "task2",
      // started
      state: 1,
      startTime: "2022-1-17",
      endTime: "2022-2-01"
    },{
      name: "task3",
      // finished
      state: 2,
      startTime: "2021-12-22",
      endTime: "2022-1-2"
    }],


    /**
     * More page's data
     */
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    name: "",
    position: "Project Manager",

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.login({
      success: (res) => {
        console.log(res)
      }
    })


    wx.setNavigationBarTitle({
      title: this.data.pageName[this.data.active],
    }),
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          name: res.userInfo.userNickName
        })
      }
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
  onShareAppMessage: function () {

  },



  /**
   * Global method
   */

  onChangeTab(event) {
    this.setData({ active: event.detail });
    wx.setNavigationBarTitle({
      title: this.data.pageName[this.data.active],
    })
  },



  /**
   * Message page's method
   */
  clickMessage(event) {
    wx.navigateTo({
      url: '../message/message/message?sender=' + event.target.id,
    })
  },

  clickNotification(event) {
    // wx.navigateTo({
      // url: '',
    // })
  },



   
  /**
   * Project page's method
   */
  clickMyTask(event) {
    wx.navigateTo({
      url: '../project/taskInfo/taskInfo',
    })
  },

  clickStatisticReport(event) {
    wx.navigateTo({
      url: '../project/statisticReport/statisticReport',
    })
  },

  clickProject(event) {
    wx.navigateTo({
      url: '../project/projectInfo/projectInfo?project=' + event.target.id,
    })
  },


   
  /**
   * Dashboard page's method
   */
  clickTask(event) {
    console.log(event.target)
    wx.navigateTo({
      url: '../project/taskInfo/taskInfo?task=' +  event.target.id,
    })
  },


  
  /**
   * More page's method
   */
  
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },

  onSetting: function(){
    wx.navigateTo({
      url: '../more/setting/setting',
    })
  },
  
  onMoreInfo: function(){
    wx.navigateTo({
      url: '../more/moreInfo/moreInfo',
    })
  }
})