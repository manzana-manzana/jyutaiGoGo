require("dotenv").config({ path: "./.env" });

const RtcTokenBuilder= require("./agora_tools/RtcTokenBuilder").RtcTokenBuilder;
const RtcRole= require("./agora_tools/RtcTokenBuilder").RtcTokenBuilder;

const appId = process.env.AGORA_APP_ID;
const appCertificate = process.env.AGORA_APP_CERTIFICATE;

module.exports = {
  token(req,res){
console.log("check");

    //全員強制的に共同ホスト
    const {uid, channelName,} = req.body;
    const role = 1;//1

    // Token validity time in seconds
    const tokenExpirationInSecond = 3600;
    // The validity time of all permissions in seconds
    const privilegeExpirationInSecond = 3600;

    // Generate Token
    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      role,
      tokenExpirationInSecond,
      privilegeExpirationInSecond);
    console.log("Token:", token);

    return res.status(200).json({code: 200, token});

  }
}