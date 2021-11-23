var app = getApp();
Page({
  data: {
    index: 0,
    tip: '',
    address: '',//显示的地址
    region: ['北京市', '北京市', '大兴区'],
    customItem: '全部',
    addressId: '',
    sex: '',
    phone: '',
    num: '',
    userName: '',
  },
  onLoad: function (e) {
    var addressId = e.addressId;
    if (addressId != null && addressId != '') {
      this.setData({ addressId: addressId });
      this.loadAddressInfo(addressId);
    }
  },
  loadAddressInfo: function (addressId) {//获取地址详情
    var that = this;
    wx.cloud.callFunction({ // 调用云函数  
      name: 'getAddressInfo',
      data:{
        _id: addressId
      },
      success: res => {
        console.log('[云函数] [getAddressInfo] 地址信息: ', res);
        var addresses = res.result.data;
        that.setData({ userName: addresses[0].personName });
        that.setData({ sex: addresses[0].gender });
        that.setData({ phone: addresses[0].contactNumber });
        that.setData({ num: addresses[0].houseNumber });
        that.setData({ address: addresses[0].address });
        var cities = addresses[0].city;
        var region = cities.split(',');
        that.setData({ region: region });
      },
      fail: err => {
        console.error('[云函数] [getAddressInfo] 调用失败', err);
      }
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    });
  },
  formSubmit: function (e) {
    var citys = e.detail.value.city; //所在城市
    var that = this;
    var personName = e.detail.value.userName; //联系人
    var gender = e.detail.value.sex; //性别
    var contactNumber = e.detail.value.phone; //手机号
    var address = e.detail.value.address; //收货地址
    var houseNumber = e.detail.value.num; //门牌号
    var citys = e.detail.value.city; //所在城市

    var city = citys[0];
    if (citys[1] != '全部') {
      city += ',' + citys[1];
    }
    if (citys[2] != '全部') {
      city += ',' + citys[2];
    }
    var ret = that.check(personName, gender, contactNumber, address, houseNumber, city);
    var addressId = this.data.addressId;
    if(ret){
      if (addressId == null || addressId == '') {
        //新增地址
        that.addressAdd(personName, gender, contactNumber, address, houseNumber, city);
      }else{
        //修改地址
        that.addressEdit(personName, gender, contactNumber, address, houseNumber, city, addressId);
      }
    }
  },
  addressAdd: function (personName, gender, contactNumber, address, houseNumber, city){//新增地址
    wx.cloud.callFunction({ // 调用云函数  
      name: 'addressAdd',
      data: {
        personName: personName,
        gender: gender,
        contactNumber: contactNumber,
        address: address,
        houseNumber: houseNumber,
        city: city
      },
      success: res => {
        console.log('[云函数] [addressAdd] 地址添加返回信息: ', res);
        var errMsg = res.result.errMsg;
        if (errMsg == "collection.add:ok") {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              wx.reLaunch({
                url: '../address/address'
              })
            }
          })
        }
      },
      fail: err => {
        console.error('[云函数] [addressAdd] 调用失败', err);
      }
    })
  },
  addressEdit: function (personName, gender, contactNumber, address, houseNumber, city, addressId) {//新增地址
    wx.cloud.callFunction({ // 调用云函数  
      name: 'addressEdit',
      data: {
        personName: personName,
        gender: gender,
        contactNumber: contactNumber,
        address: address,
        houseNumber: houseNumber,
        city: city,
        _id: addressId
      },
      success: res => {
        console.log('[云函数] [addressEdit] 地址修改返回信息: ', res);
        var errMsg = res.result.errMsg;
        if (errMsg == "document.update:ok") {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              wx.reLaunch({
                url: '../address/address'
              })
            }
          })
        }
      },
      fail: err => {
        console.error('[云函数] [addressEdit] 调用失败', err);
      }
    })
  },
  check: function (personName, gender, contactnumber, address, housenumber, city) {
    var that = this;
    if (personName == "") {
      that.setData({
        tip: '联系人不能为空！'
      });
      return false
    }
    if (gender == '') {
      that.setData({
        tip: '性别不能为空！'
      });
      return false
    }

    if (contactnumber == '') {
      that.setData({
        tip: '手机号不能为空！'
      });
      return false
    }

    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(contactnumber)) {
      that.setData({
        tip: '手机号不合法！'
      });
      return false;
    }

    if (address == '') {
      that.setData({
        tip: '收货地址不能为空！'
      });
      return false
    }

    if (housenumber == '') {
      that.setData({
        tip: '门牌号不能为空！'
      });
      return false
    }

    if (city == '') {
      that.setData({
        tip: '所在城市不能为空！'
      });
      return false
    }

    that.setData({
      tip: ''
    });
    return true
  },
  chooseLocation: function () {
    var page = this;
    wx.chooseLocation({
      type: 'gcj02',
      success: function (res) {
        var address = res.name;
        var lat = res.latitude
        var lon = res.longitude
        page.setData({
          address: address
        })
      }
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  }
})
