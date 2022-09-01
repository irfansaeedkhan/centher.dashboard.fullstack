import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import MainRegister from "../../components/Register/MainRegister";
import { connectToWallet } from "../../utils/web3/index";

function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [connectedAccountAddress, setConnectedAccountAddress] = useState("");
  const [signup, setSignup] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    account_address: "",
    profile_image: "",
    referred_by: "",
  });

  /*
  useEffect(async () => {
    try{
        let { web3, networkid } = await connectToWallet("metamask");
  
        let metamaskAccount = await web3.eth.getAccounts();
        console.log(metamaskAccount);

    }catch(e){
      console.log("Error message : ",e)
    }
  }, []);
  */
  useEffect(()=>{
    try{
    async function fetchData() {
      // You can await here
      console.log("Fetch data ")
      ///const response = await MyAPI.getData(someId);
      let { web3, networkid } = await connectToWallet("metamask");
      // ...
      let metamaskAccount = await web3.eth.getAccounts();

      console.log(metamaskAccount)
      setConnectedAccountAddress(metamaskAccount[0])
    }
    fetchData().catch((e)=>{
      console.log(e)
    });
    }catch(e){
      console.log(e)
    }
  },[]);
  

  return (
    <MainRegister
      setShowPassword={setShowPassword}
      showPassword={showPassword}
      showConfirmPassword={showConfirmPassword}
      setShowConfirmPassword={setShowConfirmPassword}
      setSignup={setSignup}
      signup={signup}
      referrer={router.query.referrer}
    />
  );
}

export default Register;
