import cookies from "next-cookies";
import {
  createFrontUserToken,
  decryptFrontEndCookieData,
  verifyFrontEndToken,
} from "./createtoken";

module.exports.checkUserAuth = async (ctx) => {
  //Fetching cookie before pages loads
  let allcookie = await cookies(ctx);
  try {
    let { req } = ctx;

    //TO DO : Uncomment for putting uroboro in maintaince
    // return {
    //     props:{
    //         users: {
    //             uservalid:false,
    //         }
    //     },
    //     redirect: {
    //         destination: "/undermaintainance",
    //         permanent: false,
    //     }
    // };
    console.log("Getting all cookies : ", allcookie);

    //If if not found then throw error
    if (allcookie[process.env.FRONT_END_COOKIE_NAME] == undefined) {
      throw new Error("Invalid User");
    }

    //Fetching fronted cookie
    let result = allcookie[process.env.FRONT_END_COOKIE_NAME];

    //Decrypting encrypted cookie
    let decryptedCookie = await decryptFrontEndCookieData(result);

    //Verifying JSON received after decrypting token
    await verifyFrontEndToken({ jwtToken: decryptedCookie });

    //If jwt token is valid then decoding it
    let decoded = await decodeJWT({ jwtToken: decryptedCookie });

    console.log("Decoded : ", decoded);

    //Checking role of decoded token
    if (decoded.payload.role != "User") {
      return {
        props: {
          users: {
            uservalid: false,
          },
        },
        redirect: {
          destination: "/logout",
          permanent: false,
        },
      };
    }

    return {
      props: {
        users: {
          uservalid: true,
          emailid: "test@email.com",
          uuid: "user@gmail.com",
          role: "User",
        },
      },
    };
  } catch (e) {
    console.log(e);
    return {
      props: {
        users: {
          uservalid: false,
        },
      },
      redirect: {
        destination: `/logout`,
        permanent: false,
      },
    };
  }
};
