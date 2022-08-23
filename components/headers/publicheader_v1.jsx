import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router'
import Logo from '../../public/images/LogoN.svg';
import logos from '../../public/images/logoSmall.svg';
import meta from '../../public/images/meta.png';
import bin from '../../public/images/bin.png';
import wallet from '../../public/images/wallet.png';
//import web3 from '../../utils/web3';
//import Web3Context from '../../store/web3-context';
import axios from '../../utils/axios';
import a1 from '../../public/images/a1.png';
import { toast } from 'react-toastify';
import { HiMenu } from 'react-icons/hi';
import { FaTimes } from 'react-icons/fa';
import { FiArrowUpRight } from 'react-icons/fi';
import { MdContentCopy } from 'react-icons/md';
import Search from './publicheader/Search';
//import useQuery from '../../hooks/useQuery';
import { useCallback } from 'react';
//import { transparentLayerContext } from '../../store/TransparentLayerProvider';
import SmallSidebar from './publicheader/SmallSidebar';
//import Link from 'next/link';

const PublicHeader = () => {
  //const query = useQuery();
  //const referrer = query.get('referrer');
  //const chat = useQuery();
  // eslint-disable-next-line no-unused-vars
  //const chatAccountAddress = chat.get('account_address');
  //const authCtx = useContext(authContext);
  
  const history = useRouter();
  const [isShow, setIsShow] = useState(false);
  const [isSecShow, setIsSecShow] = useState(false);
  const [isShowSignup, setIsShowSignup] = useState(false);
  const [isButtonOn, setIsButtonOn] = useState('');
  const [connectedAccountAddress, setConnectedAccountAddress] = useState('');
  const [activeFor, setActveFor] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDisconnect, setIsOpenDisconnect] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isCategory, setIsCategory] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isActiveAdult, setIsActiveAdult] = useState(false);
  const [avatarsList, setAvatarsList] = useState([]);
  const [signup, setSignup] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    account_address: '',
    profile_image: 'avatar-1.png',
    referred_by: ''
  });
  const [profileImage, setProfileImage] = useState();
  //const web3Ctx = useContext(Web3Context);
  const authCtx = null
  const web3Ctx = null
  //const transparentLayerCtx = useContext(transparentLayerContext);
  const transparentLayerCtx = null

  const connectMenuClickHandler = useCallback(() => {
    if (!isOpenDisconnect) {
      setIsOpenDisconnect(true);
      transparentLayerCtx.open(() => {
        setIsOpenDisconnect(false);
        transparentLayerCtx.close();
      });
    } else {
      setIsOpenDisconnect(false);
      transparentLayerCtx.close();
    }
  });

  const connectSidebarClickHandler = useCallback(() => {
    if (!isOpen) {
      setIsOpen(true);
      transparentLayerCtx.open(() => {
        setIsOpen(false);
        transparentLayerCtx.close();
      });
    } else {
      setIsOpenDisconnect(false);
      transparentLayerCtx.close();
    }
  });

  useEffect(() => {
    setSignup((prev) => {
      return { ...prev, account_address: connectedAccountAddress };
    });
  }, [connectedAccountAddress]);

  useEffect(() => {
    // let url = window.location.href.split('/');

    // let exactUrl = url[url.length - 1];
    // setActveFor(exactUrl);
  }, []);

  // useEffect(() => {
  //   if (referrer) {
  //     if (web3.utils.isAddress(referrer) && web3.utils.isAddress(connectedAccountAddress)) {
  //       if (
  //         web3.utils.toChecksumAddress(connectedAccountAddress) ===
  //         web3.utils.toChecksumAddress(referrer)
  //       ) {
  //         setSignup((prev) => {
  //           return { ...prev, referred_by: '' };
  //         });
  //       } else {
  //         setSignup((prev) => {
  //           return { ...prev, referred_by: referrer };
  //         });
  //       }
  //     }

  //     if (web3.utils.isAddress(referrer) && !authCtx?.user) {
  //       setIsShowSignup(true);
  //     } else {
  //       setIsShowSignup(false);
  //     }
  //   }
  // }, [referrer, connectedAccountAddress]);

//   useEffect(() => {
//     (async () => {
//       if (!web3.currentProvider?.isMetaMask) {
//         return;
//       }
//       const account_address = await web3Ctx.loadAccount(web3);
//       setConnectedAccountAddress(web3.utils.toChecksumAddress(account_address));
//     })();
//   }, []);

//   useEffect(() => {
//     (async () => {
//       try {
//         const promise2 = axios.get(`${process.env.REACT_APP_API_URL}/api/public/avatars.json`);

//         const [avatars] = await Promise.all([promise2]);

//         setAvatarsList(avatars.data);
//       } catch (error) {
//         console.log(error);
//       }
//     })();
//   }, []);

  // useEffect(() => {
  //   let count = 0;
  //   axios
  //     .get(`${process.env.REACT_APP_API_URL}/api/conversations/readMessageInConversation`)
  //     .then((res) => {
  //       for (let i = 0; i < res.data.conversations.length; i++) {
  //         res.data.conversations[i].messages.forEach((msg) => {
  //           if (
  //             web3.utils.toChecksumAddress(msg.sender) !==
  //               web3.utils.toChecksumAddress(authCtx.user.account_address) &&
  //             msg.status === 'unread'
  //           ) {
  //             count += 1;
  //           }
  //         });
  //       }
  //       setUnreadMessages(count);
  //     });
  // }, [chatAccountAddress]);

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
    setIsShow(false);
    return account_address;
  };

  // eslint-disable-next-line no-unused-vars
  async function handleClickSignup() {
    let account_address = connectedAccountAddress;

    if (!account_address) {
      account_address = await connectMetamask();
    }

    let chainId = await web3Ctx.loadNetworkId(web3);
    if (process.env.NODE_ENV === 'production' && chainId !== 56) {
      toast.error(`Please Connect Your Wallet to BSC Mainnet!`, {
        theme: 'colored',
        autoClose: 5000
      });
      return;
    }
    if (!account_address) {
      return;
    }

    setSignup((prev) => {
      return { ...prev, account_address };
    });

    setIsShowSignup(true);
  }

  async function handleSubmitSignup(e) {
    /*
    e.target.disabled = true;
    e.target.innerText = 'Signing up...';

    if (!signup.profile_image.trim()) {
      e.target.disabled = false;
      e.target.innerText = 'Signup';
      toast.error('Profile Image is required!', {
        theme: 'colored',
        autoClose: 5000
      });
      return;
    }

    if (!signup.username.trim()) {
      e.target.disabled = false;
      e.target.innerText = 'Signup';
      toast.error('Username is required!', {
        theme: 'colored',
        autoClose: 5000
      });
      return;
    }

    if (!signup.first_name.trim()) {
      e.target.disabled = false;
      e.target.innerText = 'Signup';
      toast.error('First Name is required!', {
        theme: 'colored',
        autoClose: 5000
      });
      return;
    }

    if (!signup.last_name.trim()) {
      e.target.disabled = false;
      e.target.innerText = 'Signup';
      toast.error('Last Name is required!', {
        theme: 'colored',
        autoClose: 5000
      });
      return;
    }

    if (!signup.email.trim()) {
      e.target.disabled = false;
      e.target.innerText = 'Signup';
      toast.error('Email is required!', {
        theme: 'colored',
        autoClose: 5000
      });
      return;
    }

    if (!signup.account_address.trim()) {
      e.target.disabled = false;
      e.target.innerText = 'Signup';
      toast.error('Account Address is required!', {
        theme: 'colored',
        autoClose: 5000
      });
      return;
    }

    if (signup.referred_by) {
      if (!web3.utils.isAddress(signup.referred_by)) {
        e.target.disabled = false;
        e.target.innerText = 'Signup';
        toast.error('Invalid Referral Link!', {
          theme: 'colored',
          autoClose: 5000
        });
        return;
      }
    }

    // eslint-disable-next-line
    if (!/^[A-Za-z0-9._]+$/.test(signup.username)) {
      e.target.innerText = 'Signup';
      e.target.disabled = false;
      toast.error('Username should only contain alphabets numbers _ and .', {
        theme: 'colored',
        autoClose: 5000
      });
      return;
    }

    if (
      // eslint-disable-next-line
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        signup.email
      )
    ) {
      e.target.innerText = 'Signup';
      e.target.disabled = false;
      toast.error('Email is Invalid!', {
        theme: 'colored',
        autoClose: 5000
      });
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, signup);
      setIsShowSignup(false);
      setIsShow(true);
      toast.success('Successfully Signup !', {
        theme: 'colored',
        autoClose: 5000
      });
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message_description, {
          theme: 'colored',
          autoClose: 5000
        });
      }
      e.target.innerText = 'Signup';
      e.target.disabled = false;
    }
    */
  }

  async function loginWithMetamask(e) {
    /*
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

    if (authCtx &&authCtx.jwt !== 'logged_out') {
      e.target.disabled = false;
      e.target.innerText = 'Connect';
      return;
    }

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
      setIsShow(false);
      setIsButtonOn('');
    } catch (error) {
      e.target.disabled = false;
      e.target.innerText = 'Connect';
      toast.error(error.response?.data?.message_description || 'Something went wrong!', {
        theme: 'colored',
        autoClose: 5000
      });
    }*/
  }

  async function handleLogout() {
    /*
    if (!authCtx.user || authCtx.jwt === 'logged_out') {
      toast.error('You are not Logged in!', {
        theme: 'colored',
        autoClose: 5000
      });
      return;
    }

    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/logout`);
      history.push('/');
      transparentLayerCtx.close();
      res = res.data;
      authCtx.setJwt(res.token);
      authCtx.setUser(null);
      authCtx.setTokens(connectedAccountAddress, res.token);
      setIsOpenDisconnect(false);
      toast.success('Wallet Disconnected', {
        theme: 'colored',
        autoClose: 5000
      });
    } catch (error) {
      toast.error(error.response?.data?.message_description || 'Something went wrong!', {
        theme: 'colored',
        autoClose: 5000
      });
    }*/
  }
  /*
  let BecomeInfluencer = (
    <>
      {authCtx && authCtx.user?.influencer?.status === 'rejected' ? (
        <Link to="/influencers/become-influencer/rejected">
          <button
            className={
              `bg-gray-shade-3 rounded-lg px-3 py-3 text-xs font-semibold text-yellow-theme hover:bg-yellow-theme hover:text-black dynamicTranss ` +
              (activeFor === 'users/profile' ? ' hidden ' : 'xl:flex lg:flex md:hidden sm:hidden')
            }>
            Become Influencer
          </button>
          <button
            className={
              `bg-gray-shade-3 rounded-lg px-3 py-3 text-xs font-semibold text-yellow-theme hover:bg-yellow-theme hover:text-black dynamicTranss  ` +
              (activeFor === 'users/profile' ? ' hidden ' : 'xl:hidden lg:hidden md:flex sm:flex')
            }>
            Become Influencer
          </button>
        </Link>
      ) : (
        <Link to="/influencers/become-influencer">
          <button
            className={
              `bg-gray-shade-3 rounded-lg px-3 py-3 text-xs font-semibold text-yellow-theme hover:bg-yellow-theme hover:text-black dynamicTranss ` +
              (activeFor === 'users/profile' ? ' hidden ' : 'xl:flex lg:flex md:hidden sm:hidden')
            }>
            Become Influencer
          </button>
          <button
            className={
              `bg-gray-shade-3 rounded-lg px-3 py-3 text-xs font-semibold text-yellow-theme hover:bg-yellow-theme hover:text-black dynamicTranss ` +
              (activeFor === 'users/profile' ? ' hidden ' : 'xl:hidden lg:hidden md:flex sm:flex')
            }>
            Become Influencer
          </button>
        </Link>
      )}
    </>
  );

  if (authCtx && authCtx.user && authCtx.user.roles.includes('influencer')) {
    if (authCtx?.user.influencer.status == 'approved') {
      BecomeInfluencer = (
        <Link to="/nfts/create">
          <button className="bg-gray-shade-3 rounded-lg px-3 py-3 font-semibold text-xs text-yellow-theme hover:bg-yellow-theme hover:text-black xl:flex lg:flex md:hidden sm:hidden dynamicTranss">
            Create NFT
          </button>
          <button className="bg-gray-shade-3 rounded-lg px-3 py-3 font-semibold text-xs text-yellow-theme hover:bg-yellow-theme hover:text-black dynamicTranss xl:hidden lg:hidden md:flex sm:flex">
            Create NFT
          </button>
        </Link>
      );
    } else {
      BecomeInfluencer = null;
    }
  }

  if (authCtx && authCtx.user && authCtx.user.roles.includes('pending_influencer')) {
    BecomeInfluencer = (
      <>
        <button
          className={
            `bg-gray-shade-3 rounded-lg px-3 py-3 text-xs font-semibold text-yellow-theme  cursor-not-allowed ` +
            (activeFor === 'users/profile' ? ' hidden ' : 'xl:flex lg:flex md:hidden sm:hidden')
          }>
          Influencer Pending
        </button>
        <button
          className={
            ` bg-gray-shade-3 rounded-lg px-3 py-3 text-xs font-semibold text-yellow-theme  cursor-not-allowed ` +
            (activeFor === 'users/profile' ? ' hidden ' : 'xl:hidden lg:hidden md:flex sm:flex')
          }>
          Influencer Pending
        </button>
      </>
    );
  }*/
  const copyText = () => {
    navigator.clipboard.writeText(connectedAccountAddress);
    toast.success('Copied Successfully!', {
      theme: 'colored',
      autoClose: 4000
    });
  };
  const copyReferral = () => {
    /*
    navigator.clipboard.writeText(
      `${window.location.origin}?referrer=${authCtx?.user.account_address}`
    );
    toast.success('Copied Successfully!', {
      theme: 'colored',
      autoClose: 4000
    });
    */
  };

  return (
    <div className="bg-[#141416] border-b border-[#26263099]/60 h-[96px] xl:px-8 lg:px-14 md:px-10 sm:px-4 flex justify-between font-monto">
      <div className="flex xl:gap-10 lg:gap-5 md:gap-5 items-center">
        {/* <Link to="/">
          <img src={Logo} alt="logo" className="lg:w-60 xl:flex lg:flex md:hidden sm:hidden" />
          <img
            src={logos}
            alt="logo"
            className="xl:hidden lg:hidden md:flex sm:flex w-16 sm:w-18"
          />
        </Link> */}
      </div>
      <div className="flex xl:gap-6 lg:gap-6 md:gap-6 sm:gap-2 items-center relative">
        <Search />
        <span className="border h-[14px] border-[#C4C4C44D]/30 md:flex sm:hidden"></span>
        {/* {authCtx.jwt !== 'logged_out' && (
          <Link
            to="/"
            className="bg-gray-shade-3 rounded-lg px-3 py-3 font-semibold text-xs text-yellow-theme hover:bg-yellow-theme hover:text-black xl:flex lg:flex md:hidden sm:hidden dynamicTranss">
            Home
          </Link>
        )}
        {authCtx.jwt !== 'logged_out' && (
          <button
            className="bg-gray-shade-3 rounded-lg px-3 py-3 font-semibold text-xs text-yellow-theme hover:bg-yellow-theme hover:text-black xl:flex lg:flex md:hidden sm:hidden dynamicTranss"
            onClick={() => setIsCategory(true)}>
            Explore
          </button>
        )} */}
        {/*authCtx.jwt !== 'logged_out' && (
          <div className="xl:flex lg:flex md:hidden sm:hidden">
            {authCtx.user && BecomeInfluencer}
          </div>
        )*/}
        {/* {authCtx.jwt === 'logged_out' && (
          <>
            <button
              className="text-yellow-theme bg-gray-shade-3 hover:bg-yellow-theme px-3 py-2 text-sm cursor-pointer font-semibold rounded-lg hover:text-black dynamicTranss  lg:flex md:flex sm:hidden"
              onClick={handleClickSignup}>
              Register
            </button>
            <button
              className="text-yellow-theme text-sm cursor-pointer font-semibold rounded-lg hover:text-black dynamicTranss  lg:hidden md:hidden sm:flex"
              onClick={handleClickSignup}>
              Register
            </button>
          </>
        )} */}
        { authCtx && authCtx.jwt === 'logged_out' ? (
          <button
            className="bg-yellow-theme rounded-lg px-3 py-2 text-sm font-semibold text-black-shade-2 hover:bg-gray-shade-3 hover:text-yellow-theme  dynamicTranss"
            onClick={() => setIsShow(true)}>
            Connect
          </button>
        ) : (
          <>
            {/* <div className=" bg-yellow-theme rounded-lg px-3 py-2 text-sm font-semibold text-black-shade-2 md:flex sm:hidden ">
            {connectedAccountAddress.slice(0, 4) + '...' + connectedAccountAddress.slice(38, 42)}
          </div> */}
            {/* <Link
              to="/messenger"
              className="text-yellow-theme w-[48px] h-[48px] cursor-pointer text-2xl dynamicTranss relative bg-gray-shade-3 rounded-full flex items-center justify-center">
              <SiMessenger />
              {unreadMessages > 0 ? (
                <>
                  <div className="absolute top-0 right-0 -mr-1 -mt-1 w-4 h-4 rounded-full bg-yellow-theme animate-ping"></div>
                  <div className="absolute top-0 right-0 -mr-1 -mt-1 w-4 h-4 rounded-full bg-yellow-theme"></div>
                </>
              ) : null}
            </Link> */}
          </>
        )}
        {/* {authCtx.user && authCtx.jwt !== 'logged_out' && connectedAccountAddress && (
          <Notification />
        )} */}
        {authCtx && authCtx.user && authCtx.jwt !== 'logged_out' && connectedAccountAddress && (
          <div className={`relative dpImagePreview ${isOpenDisconnect ? 'z-50' : ''}`}>
            <div onClick={connectMenuClickHandler}>
              {authCtx.user.custom_image ? (
                <img
                  src={authCtx.user.profile_image}
                  alt={authCtx.user.username}
                  className="cursor-pointer  dynamicTranss rounded-full"
                  style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                />
              ) : (
                <img
                  src={`${process.env.REACT_APP_API_URL}/${authCtx.user.profile_image}`}
                  alt={authCtx.user.username}
                  className="cursor-pointer dynamicTranss rounded-full bg-gray-shade-3 object-cover"
                  style={{ width: '48px', height: '48px' }}
                />
              )}
            </div>

            {isOpenDisconnect ? (
              <div
                className="absolute md:w-80 sm:w-64 bordersetall right-0  gradientborders z-50"
                style={{ padding: '0.1rem', top: '3.5rem' }}>
                <div style={{ padding: '1rem' }} className="flex flex-col gap-3 text-white">
                  <span className="flex justify-between text-sm">
                    <span className="text-lg font-semibold text-transparent bg-clip-text anim">
                      Account
                    </span>
                  </span>
                  <div className="flex gap-2 items-center">
                    <button onClick={() => transparentLayerCtx.close()}>
                      {/* <Link
                        to={
                            authCtx && authCtx.user.roles.includes('influencer') &&
                          authCtx.user.influencer.status === 'approved'
                            ? `/influencers/${authCtx.user.account_address}`
                            : `/users/${authCtx.user.account_address}`
                        }>
                        {authCtx && authCtx.user.custom_image ? (
                          <img
                            src={authCtx.user.profile_image}
                            alt={authCtx.user.username}
                            className="cursor-pointer  dynamicTranss rounded-full"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                        ) : (
                          <img
                            src={`${process.env.REACT_APP_API_URL}/${authCtx.user.profile_image}`}
                            alt={authCtx.user.username}
                            className="cursor-pointer dynamicTranss rounded-full bg-gray-shade-3 object-cover"
                            style={{ width: '40px', height: '40px' }}
                          />
                        )}
                      </Link> */}
                    </button>
                    <div className="flex flex-col gap-1 ">
                      <span className="flex gap-2 items-center">
                        <button onClick={() => transparentLayerCtx.close()}>
                          {/* <Link
                            to={
                              authCtx.user.roles.includes('influencer') &&
                              authCtx.user.influencer.status === 'approved'
                                ? `/influencers/${authCtx.user.account_address}`
                                : `/users/${authCtx.user.account_address}`
                            }
                            className="dynamicTranss hoverText">
                            <span>
                              {connectedAccountAddress.slice(0, 6) +
                                '...' +
                                connectedAccountAddress.slice(36, 42)}
                            </span>
                          </Link> */}
                        </button>
                        <MdContentCopy
                          className="cursor-pointer text-lg hoverText dynamicTranss "
                          onClick={copyText}
                        />
                        <a href='#'
                        //   href={
                        //     process.env.NODE_ENV !== 'production'
                        //       ? `https://testnet.bscscan.com/address/${authCtx?.user?.account_address}`
                        //       : `https://bscscan.com/address/${authCtx?.user?.account_address}`
                        //   }
                          target={'_blank'}
                          rel="noreferrer"
                          title="View on BSC Scan">
                          <FiArrowUpRight className="cursor-pointer text-lg hoverText dynamicTranss " />
                        </a>
                      </span>
                      <span className="text-sm" style={{ color: '#ABAFC4' }}>
                        MetaMask
                      </span>
                    </div>
                  </div>
                  <div className="w-full flex justify-end items-end">
                    <button
                      className=" bordersetall text-sm hover:bg-yellow-theme hover:text-black font-semibold dynamicTranss"
                      style={{ padding: '0.75rem' }}
                      onClick={handleLogout}>
                      Disconnect
                    </button>
                  </div>
                  <hr className="border-gray-700" />
                  <div className="flex flex-col gap-2">
                    <span className="text-lg font-semibold text-transparent bg-clip-text anim">
                      Referral Link
                    </span>
                    <span className="px-2 py-3 bordersetall w-full flex gap-2 items-center">
                      {/* <span className="w-4/5 overflow-x-scroll whitespace-nowrap">{`${window.location.origin}?referrer=${authCtx?.user.account_address}`}</span> */}
                      <MdContentCopy
                        className="cursor-pointer text-lg hoverText dynamicTranss w-1/5 "
                        onClick={copyReferral}
                      />
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        <button
          onClick={connectSidebarClickHandler}
          className="xl:hidden lg:hidden md:flex sm:flex text-yellow-theme cursor-pointer dynamicTranss relative bg-gray-shade-3 rounded-full flex items-center justify-center"
          style={{ width: '48px', height: '48px', fontSize: '2rem' }}>
          {isOpen ? (
            <FaTimes className=" text-yellow-theme" style={{ fontSize: '2rem' }} />
          ) : (
            <HiMenu className=" text-yellow-theme" style={{ fontSize: '2rem' }} />
          )}
        </button>
      </div>

      {isShow ? (
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-scroll fixed inset-0 z-50 outline-none focus:outline-none backdrop-filter backdrop-blur-lg font-monto">
          <div className="relative lg:p-4 xl:p-4 sm:p-4 md:p-4 p-12">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-black-shade-1 outline-none focus:outline-none lg:p-6 xl:p-6 md:p-6 sm:p-4  lg:w-120 xl:w-120 sm:w-full md:w-120 w-full">
              {/*header*/}
              <div className="flex  flex-wrap-reverse items-center justify-between rounded-t xl:mb-6 lg:mb-6 md:mb-6 sm:mb-2">
                <h3 className="  text-transparent bg-clip-text text-34 font-semibold anim">
                  Connect with:
                </h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-white opacity-100 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setIsShow(false)}>
                  <span className="bg-transparent text-white opacity-100 h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>
              {/*body*/}
              <div className="flex flex-col gap-2">
                <button
                  className={
                    `w-full flex items-center justify-between p-3 rounded-lg focus:outline-none focus:border-yellow-theme focus:ring-1 focus:ring-yellow-theme` +
                    (isButtonOn === 'MetaMask' ? '  bordersetyellow ' : '')
                  }
                  onClick={() => setIsButtonOn('MetaMask')}>
                  <span className="text-white">MetaMask</span>
                  <img src={meta} alt="meta" />
                </button>
                <button
                  className="w-full flex items-center justify-between p-3 rounded-lg text-left focus:outline-none focus:border-yellow-theme focus:ring-1 focus:ring-yellow-theme"
                  onClick={() => setIsButtonOn('Binance')}>
                  <span className="text-white">Binance Chain Wallet</span>
                  <img src={bin} alt="bin" />
                </button>
                <button
                  className="w-full flex items-center justify-between p-3 rounded-lg text-left focus:outline-none focus:border-yellow-theme focus:ring-1 focus:ring-yellow-theme"
                  onClick={() => setIsButtonOn('Wallet')}>
                  <span className="text-white">Wallet Connect</span>
                  <img src={wallet} alt="wallet" />
                </button>
              </div>
              <div className="flex w-full gap-5 sm:gap-0 justify-between xl:mt-5 lg:mt-5 md:mt-5 sm:mt-4 xl:flex-row lg:flex-row  md:flex-row sm:flex-col">
                {isButtonOn === 'MetaMask' ? (
                  <button
                    className="w-full bg-yellow-theme rounded-lg px-4 py-3 font-bold text-black-shade-2 hover:bg-gray-shade-3 hover:text-yellow-theme "
                    onClick={loginWithMetamask}>
                    Connect
                  </button>
                ) : (
                  <button
                    className="w-full bg-gray-shade-3 rounded-lg px-4 py-3 font-bold cursor-not-allowed "
                    style={{ color: '#4C516B' }}>
                    Connect
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isShowSignup && authCtx && authCtx.jwt === 'logged_out' && (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-scroll fixed inset-0 z-50 outline-none focus:outline-none backdrop-filter backdrop-blur-lg font-monto">
            <div className="relative lg:p-4 xl:p-4 sm:p-4 md:p-4 p-12">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-black-shade-1 outline-none focus:outline-none lg:p-6 xl:p-6 md:p-6 sm:p-4  lg:w-120 xl:w-120 sm:w-full md:w-120 w-full mt-80">
                <div className="flex  flex-wrap-reverse items-center justify-between rounded-t xl:mb-6 lg:mb-6 md:mb-6 sm:mb-2">
                  <h3 className="  text-transparent bg-clip-text text-34 font-semibold anim">
                    Register
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-white opacity-100 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setIsShowSignup(false)}>
                    <span className="bg-transparent text-white opacity-100 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2 items-center">
                    {profileImage !== undefined ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${profileImage}`}
                        className="bg-gray-shade-3 rounded-full"
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        alt="Profile Image"
                      />
                    ) : (
                      <img
                        src={a1}
                        className="bg-gray-shade-3 rounded-full"
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        alt="Profile Image"
                      />
                    )}
                    <button
                      className="bg-yellow-theme px-3 py-2 rounded-lg font-bold text-black"
                      onClick={() => setIsSecShow(true)}>
                      Profile Image
                    </button>
                  </div>

                  {isSecShow ? (
                    <>
                      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-filter backdrop-blur-lg">
                        <div className="relative lg:p-4 xl:p-4 sm:p-12 md:p-4 p-12 ">
                          {/*content*/}
                          <div className=" relative flex flex-col bg-black-shade-3 bordersetall focus:outline-none mx-3 pb-5 lg:p-4 xl:p-4 md:p-4 sm:p-4  lg:w-164 xl:w-164 sm:w-full md:w-140 ">
                            {/*header*/}
                            <div className="flex items-center justify-between rounded-t pb-3 ">
                              <span className=" text-transparent bg-clip-text text-34 font-semibold anim">
                                Avatars
                              </span>
                              <button
                                className="px-1 py-1 ml-auto bg-transparent border-0 text-white opacity-100 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={() => {
                                  setIsSecShow(false);
                                }}>
                                <span className="bg-transparent text-white opacity-100 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                  ×
                                </span>
                              </button>
                            </div>
                            <div
                              className="scrollSet overflow-y-scroll"
                              style={{ maxHeight: '400px' }}>
                              <div className="w-full flex gap-4 items-center justify-center flex-wrap ">
                                {avatarsList.map((avatar) => {
                                  return (
                                    <img
                                      key={avatar.path}
                                      src={`${process.env.REACT_APP_API_URL}/${avatar.path}`}
                                      alt={avatar.name}
                                      className="cursor-pointer rounded-full bg-gray-shade-3"
                                      style={{
                                        width: '60px',
                                        height: '60px',
                                        objectFit: 'cover'
                                      }}
                                      onClick={() => {
                                        setIsSecShow(false);
                                        setProfileImage(avatar.path);
                                      }}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}

                  <div className="flex flex-col gap-1 text-white">
                    <span>Username</span>
                    <input
                      type="text"
                      value={signup.username}
                      onChange={(e) => {
                        setSignup((prev) => {
                          return { ...prev, username: e.target.value.toLowerCase().trim() };
                        });
                      }}
                      className="w-full bordersetall py-3 px-4 bg-transparent focus:outline-none text-white font-semibold"
                      placeholder="Enter your Username"
                    />
                  </div>

                  <div className="flex flex-col gap-1 text-white">
                    <span>First Name</span>
                    <input
                      type="text"
                      value={signup.first_name}
                      onChange={(e) => {
                        setSignup((prev) => {
                          return { ...prev, first_name: e.target.value };
                        });
                      }}
                      className="w-full bordersetall py-3 px-4 bg-transparent focus:outline-none text-white font-semibold"
                      placeholder="Enter your First Name"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-white">
                    <span>Last Name</span>
                    <input
                      type="text"
                      value={signup.last_name}
                      onChange={(e) => {
                        setSignup((prev) => {
                          return { ...prev, last_name: e.target.value };
                        });
                      }}
                      className="w-full bordersetall py-3 px-4 bg-transparent focus:outline-none text-white font-semibold"
                      placeholder="Enter your Last Name"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-white">
                    <span>Email</span>
                    <input
                      type="text"
                      value={signup.email}
                      onChange={(e) => {
                        setSignup((prev) => {
                          return { ...prev, email: e.target.value.toLowerCase().trim() };
                        });
                      }}
                      className="w-full bordersetall py-3 px-4 bg-transparent focus:outline-none text-white font-semibold"
                      placeholder="Enter your Email"
                    />
                  </div>
                  <div className="flex flex-col gap-1 text-white">
                    <span>Account Address</span>
                    {signup.account_address ? (
                      <div className="bordersetall px-4  py-3 ">
                        <span className="w-full break-all bg-transparent focus:outline-none text-white font-semibold overflow-x-scroll block">
                          {signup.account_address}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={loginWithMetamask}
                        className="w-full py-3 px-4 items-center text-center text-black bg-yellow-theme rounded-lg font-bold mt-5 break-words">
                        Connect
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 text-white">
                    <span>
                      Referred By <span className="text-xs text-gray-300">(optional)</span>
                    </span>

                    <input
                      type="text"
                      value={referrer ? referrer : ''}
                      onChange={(e) => {
                        setSignup((prev) => {
                          return { ...prev, referred_by: e.target.value.toLowerCase().trim() };
                        });
                      }}
                      className="w-full bordersetall py-3 px-4 bg-transparent focus:outline-none text-white font-semibold"
                      placeholder="Enter Referrer Account Address"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSubmitSignup}
                  className="w-full py-3 px-4 items-center text-center text-black bg-yellow-theme rounded-lg font-bold mt-5 break-words">
                  Signup
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* {isCategory && (
        <div
          className="justify-center items-center px-7 lg:flex md:hidden sm:hidden overflow-x-hidden overflow-y-scroll fixed inset-0 z-50 outline-none focus:outline-none backdrop-filter backdrop-blur-lg font-monto"
          onClick={() => {
            setIsCategory(false);
          }}>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="border-0 rounded-lg shadow-lg relative flex flex-col bg-black-shade-1 outline-none focus:outline-none lg:p-6 xl:p-6 md:p-6 sm:p-4  lg:w-186 xl:w-186 sm:w-full md:w-120 w-full">
            <div className="flex  flex-wrap-reverse items-center justify-between rounded-t xl:mb-6 lg:mb-6 md:mb-6 sm:mb-2">
              <h3 className="  text-transparent bg-clip-text text-34 font-semibold anim">
                Select Category
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-white opacity-100 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setIsCategory(false)}>
                <span className="bg-transparent text-white opacity-100 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2 items-center w-full justify-start px-[4.688rem] pb-6">
              <Link
                to="/?category=all"
                className="hover:bg-yellow-theme text-yellow-theme hover:text-black w-44 rounded-lg  bg-gray-shade-3 px-4 items-center py-3 flex flex-col gap-2 font-semibold dynamicTranss"
                onClick={() => setIsCategory(false)}>
                <DiGhostSmall className="text-lg" />
                <span>All NFTs</span>
              </Link>
              <Link
                to="/?category=new"
                className="hover:bg-yellow-theme text-yellow-theme hover:text-black w-44 rounded-lg  bg-gray-shade-3 px-4 items-center py-3 flex flex-col gap-2 font-semibold dynamicTranss"
                onClick={() => setIsCategory(false)}>
                <MdFiberNew className="text-lg" />
                <span>New</span>
              </Link>
              <Link
                to="/?category=music"
                className="hover:bg-yellow-theme text-yellow-theme hover:text-black w-44 rounded-lg  bg-gray-shade-3 px-4 items-center py-3 flex flex-col gap-2 font-semibold dynamicTranss"
                onClick={() => setIsCategory(false)}>
                <BsMusicNoteBeamed className="text-lg" />
                <span>Music</span>
              </Link>
              <Link
                to="/?category=photography"
                className="hover:bg-yellow-theme text-yellow-theme hover:text-black w-44 rounded-lg  bg-gray-shade-3 px-4 items-center py-3 flex flex-col gap-2 font-semibold dynamicTranss"
                onClick={() => setIsCategory(false)}>
                <MdPhotoCamera className="text-lg" />
                <span>Photography</span>
              </Link>
              <Link
                to="/?category=sports"
                className="hover:bg-yellow-theme text-yellow-theme hover:text-black w-44 rounded-lg  bg-gray-shade-3 px-4 items-center py-3 flex flex-col gap-2 font-semibold dynamicTranss"
                onClick={() => setIsCategory(false)}>
                <MdSportsBaseball className="text-lg" />
                <span>Sports</span>
              </Link>
              <Link
                to="/?category=utilities"
                className="hover:bg-yellow-theme text-yellow-theme hover:text-black w-44 rounded-lg  bg-gray-shade-3 px-4 items-center py-3 flex flex-col gap-2 font-semibold dynamicTranss"
                onClick={() => setIsCategory(false)}>
                <IoLogoOctocat className="text-lg" />
                <span>Utilities</span>
              </Link>
              <Link
                to="/?category=virtual worlds"
                className="hover:bg-yellow-theme text-yellow-theme hover:text-black w-44 rounded-lg  bg-gray-shade-3 px-4 items-center py-3 flex flex-col gap-2 font-semibold dynamicTranss"
                onClick={() => setIsCategory(false)}>
                <TiWorld className="text-lg" />
                <span>Virtual worlds</span>
              </Link>
              <Link
                to="/?category=arts"
                className="hover:bg-yellow-theme text-yellow-theme hover:text-black w-44 rounded-lg  bg-gray-shade-3 px-4 items-center py-3 flex flex-col gap-2 font-semibold dynamicTranss"
                onClick={() => setIsCategory(false)}>
                <FaArtstation className="text-lg" />
                <span>Arts</span>
              </Link>
              <Link
                to="/?category=science"
                className="hover:bg-yellow-theme text-yellow-theme hover:text-black w-44 rounded-lg  bg-gray-shade-3 px-4 items-center py-3 flex flex-col gap-2 font-semibold dynamicTranss"
                onClick={() => setIsCategory(false)}>
                <GiMaterialsScience className="text-lg" />
                <span>Science</span>
              </Link>
              <Link
                to="/?category=religion"
                className="hover:bg-yellow-theme text-yellow-theme hover:text-black w-44 rounded-lg  bg-gray-shade-3 px-4 items-center py-3 flex flex-col gap-2 font-semibold dynamicTranss"
                onClick={() => setIsCategory(false)}>
                <FaPray className="text-lg" />
                <span>Religion</span>
              </Link>
              <Link
                to="/?category=collectibles"
                className="hover:bg-yellow-theme text-yellow-theme hover:text-black w-44 rounded-lg  bg-gray-shade-3 px-4 items-center py-3 flex flex-col gap-2 font-semibold dynamicTranss"
                onClick={() => setIsCategory(false)}>
                <RiWallet3Fill className="text-lg" />
                <span>Collectibles</span>
              </Link>
              <Link
                to="/?category=real-estate"
                className="hover:bg-yellow-theme text-yellow-theme hover:text-black w-44 rounded-lg  bg-gray-shade-3 px-4 items-center py-3 flex flex-col gap-2 font-semibold dynamicTranss"
                onClick={() => setIsCategory(false)}>
                <MdRealEstateAgent className="text-lg" />
                <span>Real Estate</span>
              </Link>
              <Link
                to="/?category=magic"
                className="hover:bg-yellow-theme text-yellow-theme hover:text-black w-44 rounded-lg  bg-gray-shade-3 px-4 items-center py-3 flex flex-col gap-2 font-semibold dynamicTranss"
                onClick={() => setIsCategory(false)}>
                <GiMagicPalm className="text-lg" />
                <span>Magic</span>
              </Link>
              <Link
                to="/?category=adults"
                className="hover:bg-yellow-theme text-yellow-theme hover:text-black w-44 rounded-lg  bg-gray-shade-3 px-4 items-center py-3 flex flex-col gap-2 font-semibold dynamicTranss cursor-pointer"
                onClick={() => {
                  setIsActiveAdult(true);
                  setIsCategory(false);
                }}>
                <BsExclamationTriangle className="text-lg" />
                <span>Adults</span>
              </Link>
            </div>
          </div>
        </div>
      )} */}
      {isActiveAdult ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-filter backdrop-blur-lg">
            <div className="relative lg:p-4 xl:p-4 sm:p-12 md:p-4 p-12 ">
              {/*content*/}
              <div className=" relative flex flex-col bg-black-shade-3 bordersetall focus:outline-none mx-3 pb-5 lg:p-4 xl:p-4 md:p-4 sm:p-4  lg:w-100 xl:w-100 sm:w-80 md:w-100 ">
                {/*header*/}
                <div className="flex items-center justify-between rounded-t pb-3 ">
                  <span className=" text-transparent bg-clip-text text-34 font-semibold anim">
                    Confirmation
                  </span>
                  <button
                    className="px-1 py-1 ml-auto bg-transparent border-0 text-white opacity-100 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setIsActiveAdult(false)}>
                    <span className="bg-transparent text-white opacity-100 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <p className="text-white text-center">Please Confirm that you are 18+!</p>
                <div className="flex  w-full gap-10 pt-6   h-full justify-start items-center ">
                  {/* <Link
                    to="/?category=adults"
                    className="bg-yellow-theme rounded-lg w-full py-4 items-center font-bold text-black text-center"
                    onClick={() => setIsActiveAdult(false)}>
                    Confirm
                  </Link> */}
                  <button
                    className="bg-transparent rounded-lg w-full py-4 items-center font-bold borderredall text-danger"
                    onClick={() => setIsActiveAdult(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
      {isOpen && <SmallSidebar BecomeInfluencer={BecomeInfluencer} setIsOpen={setIsOpen} />}
    </div>
  );
};

export default PublicHeader;
