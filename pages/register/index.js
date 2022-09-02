import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "../../utils/axios/index";

import MainRegister from "../../components/Register/MainRegister";
import { connectToWallet } from "../../utils/web3/index";

function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [connectedAccountAddress, setConnectedAccountAddress] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signup, setSignup] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    account_address: "",
    profile_image: "avatar-1",
    referred_by: "",
    password: "",
  });

  async function fetchData(connectWallet = true) {
    try {
      let { web3, networkid } = await connectToWallet(
        "metamask",
        connectWallet
      );
      let metamaskAccount = await web3.eth.getAccounts();
      setConnectedAccountAddress(metamaskAccount[0]);
      setSignup((prev) => {
        return {
          ...prev,
          account_address: metamaskAccount[0],
        };
      });
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    try {
      fetchData(false).catch((e) => {
        console.log(e);
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  async function handleSubmitSignup(e) {
    e.target.disabled = true;
    e.target.innerText = "Registering account..";

    if (!signup.profile_image.trim()) {
      e.target.disabled = false;
      e.target.innerText = "Register account";
      toast.error("Profile Image is required!", {
        theme: "colored",
        autoClose: 5000,
      });
      return;
    }

    if (!signup.username.trim()) {
      e.target.disabled = false;
      e.target.innerText = "Register account";
      toast.error("Username is required!", {
        theme: "colored",
        autoClose: 5000,
      });
      return;
    }

    if (!signup.first_name.trim()) {
      e.target.disabled = false;
      e.target.innerText = "Register account";
      toast.error("First Name is required!", {
        theme: "colored",
        autoClose: 5000,
      });
      return;
    }

    if (!signup.last_name.trim()) {
      e.target.disabled = false;
      e.target.innerText = "Register account";
      toast.error("Last Name is required!", {
        theme: "colored",
        autoClose: 5000,
      });
      return;
    }

    if (!signup.email.trim()) {
      e.target.disabled = false;
      e.target.innerText = "Register account";
      toast.error("Email is required!", {
        theme: "colored",
        autoClose: 5000,
      });
      return;
    }

    if (!signup.account_address.trim()) {
      e.target.disabled = false;
      e.target.innerText = "Register account";
      toast.error("Account Address is required!", {
        theme: "colored",
        autoClose: 5000,
      });
      return;
    }
    if (signup.password !== confirmPassword) {
      e.target.disabled = false;
      e.target.innerText = "Register account";
      toast.error("Confirm Password must be same!", {
        theme: "colored",
        autoClose: 5000,
      });
      return;
    }

    // if (signup.referred_by) {
    //   if (!web3.utils.isAddress(signup.referred_by)) {
    //     e.target.disabled = false;
    //     e.target.innerText = "Register account";
    //     toast.error("Invalid Referral Link!", {
    //       theme: "colored",
    //       autoClose: 5000,
    //     });
    //     return;
    //   }
    // }

    // eslint-disable-next-line
    if (!/^[A-Za-z0-9._]+$/.test(signup.username)) {
      e.target.innerText = "Register account";
      e.target.disabled = false;
      toast.error("Username should only contain alphabets numbers _ and .", {
        theme: "colored",
        autoClose: 5000,
      });
      return;
    }

    if (
      // eslint-disable-next-line
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        signup.email
      )
    ) {
      e.target.innerText = "Register account";
      e.target.disabled = false;
      toast.error("Email is Invalid!", {
        theme: "colored",
        autoClose: 5000,
      });
      return;
    }
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_PLATFORM_URL}/api/auth/signup`,
        signup
      );
      toast.success("Successfully Signup !", {
        theme: "colored",
        autoClose: 5000,
      });
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message_description, {
          theme: "colored",
          autoClose: 5000,
        });
      }
      e.target.innerText = "Register account";
      e.target.disabled = false;
    }
  }

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
      setConfirmPassword={setConfirmPassword}
      confirmPassword={confirmPassword}
      handleSubmitSignup={handleSubmitSignup}
    />
  );
}

export default Register;
