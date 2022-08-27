const { sign, verify, decode } = require('jsonwebtoken');
import jwtConfig from "../../../config/jwtConfig.json";
import CryptoJS from "crypto-js";

module.exports.createFrontUserToken = async (params) => {
    console.log("Create FrontUser ",params)
    console.log("JWT config : ",jwtConfig)
	let jwtconfig = JSON.parse(JSON.stringify(jwtConfig));
	jwtconfig.expiresIn = "10m";
    
	return await sign({ publicKey: params.publicKey, role: params.role, profilePic: params.profilePic, host:params.host }, process.env.FRONT_END_USER_KEY, jwtconfig);
}

module.exports.decryptFrontEndCookieData = async (data)=>{
	let decryptedKey = await CryptoJS.AES.decrypt(data,process.env.FRONT_END_COOKIE_Encryption);
	let original = await decryptedKey.toString(CryptoJS.enc.Utf8);
	return original;
}

module.exports.encryptCookieData = async(data)=>{
    return await CryptoJS.AES.encrypt(
        data,
        process.env.FRONT_END_COOKIE_Encryption
      ).toString();
}

module.exports.verifyFrontEndToken = async (param) => {
	return await verify(param.jwtToken, process.env.FRONT_END_USER_KEY);
}

module.exports.decodeJWT = async (param) => {
	return await decode(param.jwtToken, { complete: true });
}