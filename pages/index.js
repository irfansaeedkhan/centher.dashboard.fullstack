import { useEffect } from 'react'
import Head from 'next/head'
import PublicLayout from "../components/layout/publiclayout";
import { useDispatch } from 'react-redux';

export default function Home() {
  return (
    <PublicLayout>
      <div>Home</div>
      <div>Hello</div>
    </PublicLayout>
  )
}