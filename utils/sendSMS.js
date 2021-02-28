require('dotenv').config({path: '../.env'});
const http = require("http");
const striptags = require('striptags');
const urlencode = require('urlencode');

module.exports = (mobile,msg)=>{
   msg = striptags(msg);
   msg = urlencode(msg);
   url = "http://msg.icloudsms.com/rest/services/sendSMS/sendGroupSms?AUTH_KEY="+process.env.SMS_AUTH+"&message="+msg+"&senderId="+process.env.SMS_SENDER+"&routeId=1&mobileNos="+mobile+"&smsContentType=english";
    http.get(url,(res)=>{
        if(res.statusCode == 200){
            return "Sent";
        }else{
            return "Failed";
        }
    })
}