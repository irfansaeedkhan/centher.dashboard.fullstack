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

  async function fetchData() {
    console.log("hey");
    ///const response = await MyAPI.getData(someId);
    let { web3, networkid } = await connectToWallet("metamask", false);
    // ...
    let metamaskAccount = await web3.eth.getAccounts();
    setConnectedAccountAddress(metamaskAccount[0]);
  }

  useEffect(() => {
    try {
      fetchData().catch((e) => {
        console.log(e);
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <MainRegister
      setShowPassword={setShowPassword}
      showPassword={showPassword}
      showConfirmPassword={showConfirmPassword}
      setShowConfirmPassword={setShowConfirmPassword}
      setSignup={setSignup}
      signup={signup}
      connectedAccountAddress={connectedAccountAddress}
      referrer={router.query.referrer}
      fetchData={fetchData}
    />
  );
}

export default Register;
