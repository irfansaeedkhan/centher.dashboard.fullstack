import crypto from "crypto";
import path from "path";
import fs from "fs";

const publicKeyHeader = '-----BEGIN RSA PUBLIC KEY-----\n'
const publicKeyBody =
    'MIICCgKCAgEArgBFlkefnKXs5cWH7OmznBb1qgNMUZE1u/3OGiv+8GezhWhkuc6Z\nQX3SSUcW7nNH5G0jG8VwRHExoyGsinlEYjYXmt+bUki3KiK3cmKZUt1VmcvPJ5Kb\nHw5oBXG8TPOdiLf5DbkT0RYXADVijbibL1kyolQyk45Q4LWknqfuSemvUr4ikLLi\n5xK0b2jKf8oGmNoDRA3+cnRdFUcMyh+t1TI1sJBV5GcLAvz7oDVSYxGegPL8jS4Y\nRtkDrs5GY/p7Ip1sQU1d0RqnjVZW8gp1UGlylMYeglxtLyd5QuDX+dtN6kEqIU4U\nske9NZii6DkzGCu5rzIOm6w1TeG/Uuo+LoY0TOAf9lyEbuz1BllvWmpiusawlXr8\nDRE5YwtN2hzRmVKde0OVssvTLyDO5R05AHsZALzB/3ZFVRwVg2hba1sYEGIxZnzE\nLCr4o4iaVCO3yAuyzxkuS19kjw7S3a50SskNvoXrFQJY5eeXcDHnd9u/9IMnWvP/\nOoyZi5/aFGw2DVN88L8yR2CN/RB/0BNwzLtvnsdksjCmdaytQYAc+EEgI4Xweshi\nCFpQ2lAuiEayjX4nnDF6O9xVyxwv88x12AGta4gKWExZopa2XUQplNM+9lahx0t2\nYU2MpDe2SFj0TPUqjMVJYZSnEva4f/r53VqKx4r2t2eKRcT0wefEHmUCAwEAAQ==\n'
const publicKeyFooter = '-----END RSA PUBLIC KEY-----\n'


const encryptStringWithPublicKey = ()=>{
    let publicKey = publicKeyHeader + publicKeyBody + publicKeyFooter
    let buffer = Buffer.from(data)
    let encrypted = crypto.publicEncrypt(publicKey, buffer)
    return encrypted.toString('base64')
}