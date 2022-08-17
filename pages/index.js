import { useEffect } from 'react'
import Head from 'next/head'
import PublicLayout from "../components/layout/publiclayout";
import { useDispatch } from 'react-redux';
import { initializeStore } from '../redux/store';
import {testSetValue, testGetValue} from "../redux/action/test";
import Test1 from "../components/pages/landingpage/test1";
import Test2 from "../components/pages/landingpage/test2";

export default function Home() {
  return (
    <PublicLayout>

      <div>Home</div>
      <div>Hello</div>
      <Test1></Test1>
      <Test2></Test2>
    </PublicLayout>
  )
}

export async function getStaticProps() {
  const store = initializeStore()
  //store.dispatch(testGetValue())

  return {
    props: {},
  }
}