import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
//import authContext from '../../../store/auth-context';
//import Web3Context from '../../../store/web3-context';
//import web3 from '../../../../utils/web3';

import axios from '../../../../utils/axios';
import ConnecModal from './ConnecModal';
import RegisterModal from './RegisterModal';
//import useQuery from '../../../hooks/useQuery';

//Added new
import {connectToWallet} from "../../../../utils/web3/index";
import {setWeb3Data, disconnectWeb3, getAllValues} from "../../../../redux/action/web3";
import { connect } from 'react-redux'

const SidebarConnect = (props) => {
  console.log("Props ",props)
  //const query = useQuery();
  //const referrer = query.get('referrer');
  const referrer = "";
  const web3Ctx = null;
  const authCtx = null;
  //const web3Ctx = useContext(Web3Context);
  //const authCtx = useContext(authContext);
  const [connectModalState, setConnectModalState] = useState(false);
  const [registerModalState, setRegisterModalState] = useState(false);
  const [connectedAccountAddress, setConnectedAccountAddress] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [signup, setSignup] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    account_address: '',
    profile_image: 'avatar-1.png',
    referred_by: ''
  });

  useEffect(() => {
    setSignup((prev) => {
      return { ...prev, account_address: connectedAccountAddress };
    });
  }, [connectedAccountAddress]);

  /*
  useEffect(() => {
    (async () => {
      if (!web3.currentProvider?.isMetaMask) {
        return;
      }
      const account_address = await web3Ctx.loadAccount(web3);
      setConnectedAccountAddress(web3.utils.toChecksumAddress(account_address));
    })();
  }, []);*/

  /*
  const connectMetamask = async () => {
    if (!web3.currentProvider?.isMetaMask) {
      toast.error('Please Install MetaMask', {
        theme: 'colored',
        autoClose: 5000
      });
      return;
    }
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      toast.error(error.response?.data?.message_description || 'Something went wrong!', {
        theme: 'colored',
        autoClose: 5000
      });
      return;
    }

    const account_address = await web3Ctx.loadAccount(web3);
    setConnectedAccountAddress(web3.utils.toChecksumAddress(account_address));
    setConnectModalState(false);
    return account_address;
  };*/

  const connectMetamask = async (walletprovider="metamask") => {
    try{
      
      //Checking wether metamask exits or not
      // if (!web3.currentProvider?.isMetaMask) {
      //   toast.error('Please Install MetaMask', {
      //     theme: 'colored',
      //     autoClose: 5000
      //   });
      //   return;
      // }


      //Connecting to wallet
      console.log("Connect to wallet")
      let {web3, networkid}= await connectToWallet(walletprovider);

      //Getting account
      console.log("getting metamask account")
      let metamaskAccount = await web3.eth.getAccounts();
      
      if(metamaskAccount.length<1){
        //Checking if length of the metamask wallet is less than one
        throw new Error("Failed to connect to metamask")
      }

      let toCheckSumAddress = await web3.utils.toChecksumAddress(metamaskAccount[0])
      
      await props.setWeb3({
        web3:web3,
        networkid:networkid,
        walletname:"metamask",
        useraddress:toCheckSumAddress
      })

      return toCheckSumAddress;
    }catch(e){
      console.log(e)
      if(!e.message){
        toast.error('Failed to connect to wallet', {
          theme: 'colored',
          autoClose: 5000
        });
        return;
        //
      }

      switch(e.message){
        case "Invalid chain id":{
          console.log("Connect to binance mainnet")
          toast.error('Please connect with binance mainnet', {
            theme: 'colored',
            autoClose: 5000
          });
          break;
        }
        case "Invalid web3 provider or no provider":{
          console.log("Invalid web3 provider")
          toast.error(`Please install ${walletprovider}`, {
            theme: 'colored',
            autoClose: 5000
          });
          break;
        }
        case "Failed to fetch wallet":{
          console.log("wallet not installed")
          toast.error(`Please install extension ${walletprovider}`, {
            theme: 'colored',
            autoClose: 5000
          });
          break;
        } 
        default:{
          console.log("Someting went wrong")
          toast.error(`Something went wrong!`, {
            theme: 'colored',
            autoClose: 5000
          });
        }

      }
    }
  }

  async function loginWithMetamask(e) {
    try{
      let account_address = await connectMetamask();
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/nonce/${account_address}`
      );

      const nonce = res.data.nonce;

      console.log(props.web3);

      const data = props.web3.web3.utils.toHex('Please sign this message to Login: ' + nonce);

      const signature = await props.web3.web3.currentProvider.request({
        method: 'personal_sign',
        params: [data, account_address]
      });

      const res_login = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        account_address: account_address,
        data,
        signature
      },{
        withCredentials:true
      });

      console.log("Login : ",res_login.data)
    }catch(e){
      console.log("Login with metamask : ",e);
    }
  }


  /*
  async function loginWithMetamask(e) {
    e.target.disabled = true;
    e.target.innerText = 'Connecting...';

    let chainId = await web3Ctx.loadNetworkId(web3);
    if (process.env.NODE_ENV === 'production' && chainId !== 56) {
      toast.error(`Please Connect Your Wallet to BSC Mainnet!`, {
        theme: 'colored',
        autoClose: 5000
      });
      e.target.disabled = false;
      e.target.innerText = 'Connect';
      return;
    }
    let account_address = connectedAccountAddress;

    if (!account_address) {
      account_address = await connectMetamask();
    }

    if (!account_address) {
      e.target.disabled = false;
      e.target.innerText = 'Connect';
      return;
    }

    // if (authCtx.jwt !== 'logged_out') {
    //   e.target.disabled = false;
    //   e.target.innerText = 'Connect';
    //   return;
    // }

    try {
      // Get Nonce
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/nonce/${account_address}`
      );
      const nonce = res.data.nonce;

      const data = web3.utils.toHex('Please sign this message to Login: ' + nonce);

      const signature = await web3.currentProvider.request({
        method: 'personal_sign',
        params: [data, account_address]
      });

      const res_login = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        account_address: account_address,
        data,
        signature
      });
      toast.success('Wallet is Connected!', {
        theme: 'colored',
        autoClose: 5000
      });

      authCtx.setJwt(res_login.data.token);
      authCtx.setUser(res_login.data.user);
      authCtx.setTokens(web3.utils.toChecksumAddress(account_address), res_login.data.token);

      e.target.disabled = false;
      e.target.innerText = 'Connect';
      setConnectModalState(false);
      setSelectedWallet('');
    } catch (error) {
      e.target.disabled = false;
      e.target.innerText = 'Connect';
      toast.error(error.response?.data?.message_description || 'Something went wrong!', {
        theme: 'colored',
        autoClose: 5000
      });
    }
  }*/

  useEffect(() => {
    if (referrer) {
      if (web3.utils.isAddress(referrer) && web3.utils.isAddress(connectedAccountAddress)) {
        if (
          web3.utils.toChecksumAddress(connectedAccountAddress) ===
          web3.utils.toChecksumAddress(referrer)
        ) {
          setSignup((prev) => {
            return { ...prev, referred_by: '' };
          });
        } else {
          setSignup((prev) => {
            return { ...prev, referred_by: referrer };
          });
        }
      }

      if (web3.utils.isAddress(referrer) && !authCtx?.user) {
        setRegisterModalState(true);
      } else {
        setRegisterModalState(false);
      }
    }
  }, [referrer, connectedAccountAddress]);

  const fetchValue = async ()=>{
    try{
      let web3Data = await props.getWeb3()
      console.log(props.web3)
    }catch(e){
      console.log(e)
    }
  }
  return(
    <>
      <button onClick={fetchValue}>Button</button>
      <div className="flex h-full items-end lg:mt-0 sm:mt-16">
        <div className="w-[168px] h-[232px] bg-[#1C1C21] rounded-[32px] flex flex-col p-6 gap-3">
          <div className="text-white font-semibold text-2xl">Get in to platform</div>
            <button
              className="w-full py-2 flex justify-center rounded-lg font-bold bg-yellow-theme mt-2 text-[#222531] dynamicTranss"
              onClick={() => setRegisterModalState(true)}>
              Register
            </button>
            <button
              onClick={() => setConnectModalState(true)}
              className="w-full py-2 flex justify-center rounded-lg font-bold bg-black-shade-3 mt-2 text-gray-text dynamicTranss">
              Connect
            </button>
          </div>
        </div>
        {connectModalState && (
          <ConnecModal
            setConnectModalState={setConnectModalState}
            loginWithMetamask={loginWithMetamask}
            setSelectedWallet={setSelectedWallet}
            selectedWallet={selectedWallet}
          />
        )}
        {registerModalState && (
          <RegisterModal
            setRegisterModalState={setRegisterModalState}
            loginWithMetamask={loginWithMetamask}
            setSignup={setSignup}
            signup={signup}
            referrer={referrer}
            web3={web3}
            setConnectModalState={setConnectModalState}
          />
        )}
  </>)
  // return (
  //   authCtx?.jwt === 'logged_out' && (
  //     <>
  //       <div className="flex h-full items-end lg:mt-0 sm:mt-16">
  //         <div className="w-[168px] h-[232px] bg-[#1C1C21] rounded-[32px] flex flex-col p-6 gap-3">
  //           <div className="text-white font-semibold text-2xl">Get in to platform</div>
  //           <button
  //             className="w-full py-2 flex justify-center rounded-lg font-bold bg-yellow-theme mt-2 text-[#222531] dynamicTranss"
  //             onClick={() => setRegisterModalState(true)}>
  //             Register
  //           </button>
  //           <button
  //             onClick={() => setConnectModalState(true)}
  //             className="w-full py-2 flex justify-center rounded-lg font-bold bg-black-shade-3 mt-2 text-gray-text dynamicTranss">
  //             Connect
  //           </button>
  //         </div>
  //       </div>
  //       {connectModalState && (
  //         <ConnecModal
  //           setConnectModalState={setConnectModalState}
  //           loginWithMetamask={loginWithMetamask}
  //           setSelectedWallet={setSelectedWallet}
  //           selectedWallet={selectedWallet}
  //         />
  //       )}
  //       {registerModalState && (
  //         <RegisterModal
  //           setRegisterModalState={setRegisterModalState}
  //           loginWithMetamask={loginWithMetamask}
  //           setSignup={setSignup}
  //           signup={signup}
  //           referrer={referrer}
  //           web3={web3}
  //           setConnectModalState={setConnectModalState}
  //         />
  //       )}
  //     </>
  //   )
  // );
};

const mapStateToProps = (state) => {
	console.log("State : ",state)
  // return { ...state.test };
  return {web3:state.web3}
}

const mapDispatchToProps = (dispatch) => ({
	setWeb3: (web3) => dispatch(setWeb3Data('WEB3_CONNECT', web3)),
	disconnectWeb3: () => dispatch(disconnectWeb3('WEB3_DISCONNECT')),
  getWeb3: () => dispatch(getAllValues('WEB3_GET_ALL_VALUES'))
})

export default connect(mapStateToProps, mapDispatchToProps)(SidebarConnect)
