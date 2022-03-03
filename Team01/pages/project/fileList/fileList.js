// pages/project/fileList/fileList.js
const languageUtils = require("../../../language/languageUtils");
const db = wx.cloud.database();
const _ = db.command;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 存放双语
        dictionary: {},
        language: 0,
        languageList: ["简体中文", "English"],

        feedback:{},
        navigationBar: 'Details',
        fileList: [],
        feedbackType: '',
        details: '',
        createTime: '',
        ownerId: '',
        owner:'',

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        // 初始化语言
        var lan = wx.getStorageSync("languageVersion");
        this.initLanguage();
        this.setData({
            language: lan
        })

      db.collection('project')
      .doc(options.id)
      .get({
        success: res => {
            this.setData({
              feedback: res.data.feedback[options.index],
            }),
            console.log(this.data.feedback);
            this.getType();
            this.getBelongTo();

          wx.setNavigationBarTitle({
            title: this.data.navigåationBar,
          });
        },
        fail: function(err) {
          // console.log(err)
        }
      })
    },
    getType(){

      var type = this.data.dictionary.feedback_type0;
      if(this.data.feedback.type==2){
          type = this.data.dictionary.feedback_type2;
      }
      else if(this.data.feedback.type==1){
          type = this.data.dictionary.feedback_type0;
      }
      this.setData({
        feedbackType: type,
      });

    },
    getBelongTo(){

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

    }
})