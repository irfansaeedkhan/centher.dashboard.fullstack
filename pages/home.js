import { useEffect } from "react";
import Head from "next/head";
import PublicLayout from "../components/layout/publiclayout";
import { useDispatch } from "react-redux";
import { initializeStore } from "../redux/store";
import { testSetValue, testGetValue } from "../redux/action/testv1";
import Test1 from "../components/pages/landingpage/test1";
import Test2 from "../components/pages/landingpage/test2";
import axios from "../utils/axios";
import {checkUserAuth} from "../utils/authserverside/user/index";

export const getServerSideProps = async (ctx) => {
    let authdata = await checkUserAuth(ctx);
    return authdata;
    //console.log("Authdata : ",authdata)
    // return {
    //   props: {
    //       users: "hello"
    //     },
    // }
    // if (authdata.redirect != undefined) {
    //     return {
    //     redirect: authdata.redirect,
    //     };
    // }

    // return {
    //     props: {
    //     users: authdata.props.users,
    //     },
    // };
};

export default function HomeAuth() {
  return (
    <PublicLayout>
      <div>
        <Test1></Test1>
        <Test2></Test2>
        <p className="text-3xl font-bold underline">
          Hello world!
        </p>
      </div>
    </PublicLayout>
  );
}
