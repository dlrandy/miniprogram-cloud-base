// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  var result = await db.collection('address').where({
    _openid:'oXSIY0Zx0B2p_q9Po0GxmZiIrbwM'
  }).get();
  return result;
 
}