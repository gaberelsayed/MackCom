require('dotenv').config({path: '../.env'});
const axios = require('axios').default;
const striptags = require('striptags');
const urlencode = require('urlencode');

module.exports = (mobile,msg)=>{
   msg = striptags(msg);
   msg = urlencode(msg);
   console.log(mobile,msg);
   url = "http://msg.icloudsms.com/rest/services/sendSMS/sendGroupSms?AUTH_KEY="+process.env.SMS_AUTH+"&message="+msg+"&senderId="+process.env.SMS_SENDER+"&routeId=1&mobileNos="+mobile+"&smsContentType=english";
   return axios.get(url)
}