// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  console.log(event);
  var result = await db.collection('address').add({
    data: {
      personName: event.personName,
      gender: event.gender,
      contactNumber: event.contactNumber,
      houseNumber: event.houseNumber,
      city: event.city,  
      address: event.address,
      createTime: new Date(), 
      updateTime: new Date(),
      _openid: wxContext.OPENID
    }
  });
  return result;
}