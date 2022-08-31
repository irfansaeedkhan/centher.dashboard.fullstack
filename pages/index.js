import { useEffect } from "react";
import Head from "next/head";
import PublicLayout from "../components/layout/publiclayout";
import { useDispatch } from "react-redux";
import { initializeStore } from "../redux/store";
import { testSetValue, testGetValue } from "../redux/action/testv1";
import Test1 from "../components/pages/landingpage/test1";
import Test2 from "../components/pages/landingpage/test2";
import axios from "../utils/axios";
import Link from "next/link";

export default function Home() {
  useEffect(() => {
    const fetchData = async () => {
      const result1 = await axios.get("https://app.nethernft.io/", {}, {});
      const result2 = await axios.get("https://app.nethernft.io/", {}, {});
    };

    fetchData();

    return () => {};
  }, []);
  return (
    <PublicLayout>
      <div>
        <Test1></Test1>
        <Test2></Test2>
        <p className="text-3xl font-bold underline">Hello world!</p>
        <Link href="/login">
          <button className="w-full py-2 flex justify-center rounded-lg font-bold bg-black-shade-3 mt-2 text-gray-text dynamicTranss">
            Connect
          </button>
        </Link>
      </div>
    </PublicLayout>
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
