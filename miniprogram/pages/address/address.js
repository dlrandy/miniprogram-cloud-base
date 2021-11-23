var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag:0,
    addresses:[],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  loadAddress: function () {
    wx.cloud.callFunction({
      name:'getAddresses',
      success: res => {
        console.log(res);
        var addresses = res.result.data;
        this.setData({
          addresses
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(333333333)
    this.loadAddress();
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
  addAddress:function () {
    wx.navigateTo({
      url: '../addressAdd/addressAdd',
    })
  },
  editAddress:function (e) {
    wx.navigateTo({
      url: '../addressAdd/addressAdd?addressId=' + e.currentTarget.id,
    });
  },
  deleteAddress:function (e) {
    var that = this;
    wx.cloud.callFunction({
      name: 'deleteAddress',
      data: {
        id: e.currentTarget.id
      },
      success: res => {
        var count = res.result.stats.removed;
        if (count == 1) {
          wx.showToast({
            title: 'delete done!',
            icon: 'success',
            duration: 2000,
            success:function () {
              that.loadAddress();
            }
          })
        }
      },
      fail: err => console.log(err)
    });

  },
  switchNav:function(e){
    var index = e.currentTarget.id;
    this.setData({flag:index});
  },
})