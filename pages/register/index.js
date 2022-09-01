import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import MainRegister from "../../components/Register/MainRegister";
import { connectToWallet } from "../../utils/web3/index";

function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [connectedAccountAddress, setConnectedAccountAddress] = useState("");
  let { web3, networkid } = connectToWallet("metamask");
  console.log(web3, networkid);
  const [signup, setSignup] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    account_address: "",
    profile_image: "",
    referred_by: "",
  });

  // useEffect(() => {
  //   let metamaskAccount = web3.eth.getAccounts();
  //   console.log(metamaskAccount);
  //   setConnectedAccountAddress(metamaskAccount);
  // }, []);

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
