import React, { useContext, useEffect, useState } from 'react';
//import { Link, useHistory, useLocation } from 'react-router-dom';
import { useRouter } from 'next/router'
import Link from 'next/link';
//import useQuery from '../../hooks/useQuery';
//import authContext from '../../store/auth-context';
//import Web3Context from '../../store/web3-context';
//import web3 from '../../utils/web3';
//import axios from '../../utils/axios';
import SidebarConnect from './SidebarComponent/SidebarConnect';
import { toast } from 'react-toastify';
//import { transparentLayerContext } from '../../store/TransparentLayerProvider';
import logos from '../../../public/images/logoSmall.svg';

const SmallSidebar = ({ BecomeInfluencer, setIsOpen }) => {
  //const location = useLocation();
  const pathname = "/"
  //const pathname = location.pathname.slice(1);
  //const history = useHistory();
  //const chat = useQuery();
  //const categoryQurey = useQuery();
  const category = "all"
  //const category = categoryQurey.get('category');
  //const chatAccountAddress = chat.get('account_address');
  //const authCtx = useContext(authContext);
  //const web3Ctx = useContext(Web3Context);
  const authCtx = null;
  const web3Ctx = null;
  const [connectedAccountAddress, setConnectedAccountAddress] = useState('');
  //const [unreadMessages, setUnreadMessages] = useState(0);
  //const [unreadNotifications, setUnreadNotifications] = useState([]);
  //const transparentLayerCtx = useContext(transparentLayerContext);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 800) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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

  /*useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/notifications/one_notification`)
      .then((resp) => {
        const data = resp.data.results.notifications.filter(({ status }) => status === 'unread');
        setUnreadNotifications(data);
      })
      .catch((err) => console.log(err.response));
  }, []);*/

  /*useEffect(() => {
    let count = 0;
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/conversations/readMessageInConversation`)
      .then((res) => {
        for (let i = 0; i < res.data.conversations.length; i++) {
          const filterArray = res.data.conversations[i].messages.filter(
            ({ status }) => status === 'unread'
          );
          const unreadCount = filterArray.some(
            ({ sender }) => sender !== authCtx.user?.account_address
          );
          if (unreadCount) {
            count += 1;
          }
        }
        setUnreadMessages(count);
      });
  }, [chatAccountAddress]);*/

  async function handleLogout() {
    if (!authCtx.user || authCtx.jwt === 'logged_out') {
      toast.error('You are not Logged in!', {
        theme: 'colored',
        autoClose: 5000
      });
      return;
    }

    try {
      let res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/logout`);
      setIsOpen(false);
      transparentLayerCtx.close();
      res = res.data;
      authCtx.setJwt(res.token);
      authCtx.setUser(null);
      authCtx.setTokens(connectedAccountAddress, res.token);
      toast.success('Wallet Disconnected', {
        theme: 'colored',
        autoClose: 5000
      });
      history.push('/');
    } catch (error) {
      toast.error(error.response?.data?.message_description || 'Something went wronggg!', {
        theme: 'colored',
        autoClose: 5000
      });
    }
  }

  return (
    <div className="flex lg:hidden flex-col fixed left-0 z-50 ">
      <div className="min-w-[232px] md:w-[292px] w-[232px] bg-[#141416]  font-monto  ">
        <div className="h-[96px] flex items-center md:px-10 sm:px-4 border-b border-[#26263099]/60">
          {/* <Link to="/">
            <img
              src={logos}
              alt="logo"
              className="xl:hidden lg:hidden md:flex sm:flex w-[72px] h-[72px] "
            />
          </Link> */}
        </div>
        <div className="border-r border-[#26263099]/60 h-[calc(100vh-96px)] overflow-y-scroll">
          {authCtx && authCtx.jwt !== 'logged_out' && (
            <div
              className="pt-3  pl-4 mb-2 mt-5"
              onClick={() => {
                setIsOpen(false);
                transparentLayerCtx.close();
              }}>
              {BecomeInfluencer}
            </div>
          )}
          <div className="pl-4 pr-[13px]">
            <div
              className={
                `text-[11px] font-bold pt-2 text-[#44485F] ` +
                (authCtx && authCtx.jwt === 'logged_out' && 'mt-10')
              }>
              SOCIAL NETWORK
            </div>
            <div className="mt-5 flex flex-col gap-5">
              <div className="flex items-center gap-2 cursor-pointer">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3 10.9563C3 9.72197 3.56989 8.55675 4.54424 7.79893L9.54424 3.91004C10.9887 2.78658 13.0113 2.78658 14.4558 3.91004L19.4558 7.79893C20.4301 8.55675 21 9.72197 21 10.9563V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V10.9563Z"
                    stroke={pathname === 'feed' ? 'white' : '#888DAA'}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {/* <Link
                  to="/Feed"
                  onClick={() => {
                    setIsOpen(false);
                    transparentLayerCtx.close();
                  }}
                  className={
                    `text-sm font-semibold ` +
                    (pathname === 'Feed' ? 'text-white' : 'text-gray-text')
                  }>
                  Feed
                </Link> */}
              </div>
              <div className="flex items-center gap-2 w-full cursor-pointer">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
                    stroke={pathname === 'messenger' ? 'white' : '#888DAA'}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {/* <Link
                  onClick={() => {
                    setIsOpen(false);
                    transparentLayerCtx.close();
                  }}
                  to="/messenger"
                  className={
                    `text-sm font-semibold w-[calc(100%-24px-32px)] ` +
                    (pathname === 'messenger' ? 'text-white' : 'text-gray-text')
                  }>
                  Chat
                </Link> */}
                {/* {unreadMessages > 0 && (
                  <span className="text-sm font-semibold text-[#222531] bg-yellow-theme w-8 h-5 rounded-lg flex justify-center">
                    +{unreadMessages}
                  </span>
                )} */}
              </div>
              <div className="flex items-center gap-2 w-full cursor-pointer">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 10.8946 5.48703 12.9342 4.88533 14.3309C4.49389 15.2396 5.31337 17 6.30278 17H17.6972C18.6866 17 19.5061 15.2396 19.1147 14.3309C18.513 12.9342 18 10.8946 18 8Z"
                    stroke={pathname === 'notifications' ? 'white' : '#888DAA'}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.7295 21C13.5537 21.3031 13.3014 21.5547 12.9978 21.7295C12.6941 21.9044 12.3499 21.9965 11.9995 21.9965C11.6492 21.9965 11.3049 21.9044 11.0013 21.7295C10.6977 21.5547 10.4453 21.3031 10.2695 21"
                    stroke={pathname === 'notifications' ? 'white' : '#888DAA'}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {/* <Link
                  onClick={() => {
                    setIsOpen(false);
                    transparentLayerCtx.close();
                  }}
                  to="/notifications"
                  className={
                    `text-sm font-semibold w-[calc(100%-24px-32px)] ` +
                    (pathname === 'notifications' ? 'text-white' : 'text-gray-text')
                  }>
                  Notifications
                </Link> */}
                {/* {unreadNotifications.length > 0 && (
                  <span className="text-sm font-semibold text-[#222531] bg-yellow-theme w-8 h-5 rounded-lg flex justify-center">
                    +{unreadNotifications?.length}
                  </span>
                )} */}
              </div>
              <div className="text-[11px] font-bold pt-2 text-[#44485F] mt-5">NFT Marketplace</div>
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2 cursor-pointer">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10 3H3V10H10V3Z"
                      fill={category === 'all' ? 'white' : '#888DAA'}
                      stroke={category === 'all' ? 'white' : '#888DAA'}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 3H14V10H21V3Z"
                      fill={category === 'all' ? 'white' : '#888DAA'}
                      stroke={category === 'all' ? 'white' : '#888DAA'}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 14H14V21H21V14Z"
                      fill={category === 'all' ? 'white' : '#888DAA'}
                      stroke={category === 'all' ? 'white' : '#888DAA'}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 14H3V21H10V14Z"
                      fill={category === 'all' ? 'white' : '#888DAA'}
                      stroke={category === 'all' ? 'white' : '#888DAA'}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {/* <Link
                    onClick={() => {
                      setIsOpen(false);
                      transparentLayerCtx.close();
                    }}
                    to="/?category=all"
                    className={
                      `text-sm font-semibold ` +
                      (category === 'all' ? 'text-white' : 'text-gray-text')
                    }>
                    Explore
                  </Link> */}
                </div>
                <div className="flex items-center gap-2 cursor-pointer">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_6190_21189)">
                      <path
                        d="M19 21V19C19 17.9391 18.5786 16.9217 17.8284 16.1716C17.0783 15.4214 16.0609 15 15 15H9C7.93913 15 6.92172 15.4214 6.17157 16.1716C5.42143 16.9217 5 17.9391 5 19V21"
                        stroke={pathname === 'top-influencers' ? 'white' : '#888DAA'}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                        stroke={pathname === 'top-influencers' ? 'white' : '#888DAA'}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M21.1806 4.05142C21.2924 3.95804 21.4633 4.01163 21.5017 4.15212L21.873 5.50881C21.8862 5.55715 21.9171 5.59876 21.9595 5.62541L23.1508 6.37332C23.2741 6.45077 23.276 6.62989 23.1542 6.70986L21.9787 7.48216C21.9368 7.50968 21.9068 7.55192 21.8945 7.60052L21.5513 8.96457C21.5158 9.10582 21.346 9.16292 21.2323 9.07186L20.1346 8.19248C20.0955 8.16115 20.046 8.14564 19.996 8.14903L18.5927 8.24415C18.4473 8.254 18.3406 8.11017 18.392 7.97392L18.8892 6.65813C18.9069 6.61125 18.9063 6.55943 18.8877 6.51292L18.3635 5.20766C18.3093 5.07249 18.413 4.9265 18.5585 4.93335L19.9635 4.99954C20.0136 5.00189 20.0627 4.98537 20.1012 4.95324L21.1806 4.05142Z"
                        fill={pathname === 'top-influencers' ? 'white' : '#888DAA'}
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_6190_21189">
                        <rect
                          width="24"
                          height="24"
                          fill={pathname === 'top-influencers' ? 'white' : '#888DAA'}
                        />
                      </clipPath>
                    </defs>
                  </svg>

                  {/* <Link
                    onClick={() => {
                      setIsOpen(false);
                      transparentLayerCtx.close();
                    }}
                    to="/top-influencers"
                    className={
                      `text-sm font-semibold ` +
                      (pathname === 'top-influencers' ? 'text-white' : 'text-gray-text')
                    }>
                    Top influencers
                  </Link> */}
                </div>
                <div className="flex items-center gap-2 cursor-pointer">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9.06055 11.8999L17.1305 3.83992C17.3936 3.56836 17.7081 3.35186 18.0556 3.20303C18.4032 3.05419 18.7769 2.97599 19.1549 2.97299C19.533 2.96999 19.9079 3.04224 20.2577 3.18553C20.6076 3.32883 20.9255 3.5403 21.1928 3.80765C21.4602 4.07499 21.6716 4.39285 21.8149 4.74272C21.9582 5.09259 22.0305 5.46747 22.0275 5.84554C22.0245 6.22361 21.9463 6.59729 21.7974 6.94484C21.6486 7.29239 21.4321 7.60686 21.1605 7.86992L13.1005 15.9499"
                      stroke={pathname === 'create-collection' ? 'white' : '#888DAA'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.07002 14.9399C5.41002 14.9399 4.07002 16.2899 4.07002 17.9599C4.07002 19.2899 1.57002 19.4799 2.07002 19.9799C3.15002 21.0799 4.56002 21.9999 6.07002 21.9999C8.27002 21.9999 10.07 20.1999 10.07 17.9599C10.0713 17.5647 9.99478 17.173 9.84473 16.8073C9.69468 16.4416 9.47407 16.1091 9.19549 15.8286C8.91691 15.5482 8.58583 15.3254 8.22114 15.1729C7.85645 15.0204 7.4653 14.9413 7.07002 14.9399V14.9399Z"
                      stroke={pathname === 'create-collection' ? 'white' : '#888DAA'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {/* <Link
                    onClick={() => {
                      setIsOpen(false);
                      transparentLayerCtx.close();
                    }}
                    to="/create-collection"
                    className={
                      `text-sm font-semibold ` +
                      (pathname === 'create-collection' ? 'text-white' : 'text-gray-text')
                    }>
                    Create Collection
                  </Link> */}
                </div>
                <div className="text-[11px] font-bold pt-2 text-[#44485F] mt-5">
                  Decentralized Finance
                </div>
                <div className="flex items-center gap-2 cursor-pointer">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12.0002 8.99895V7.99854"
                      stroke={pathname === 'Staking-Pack' ? 'white' : '#888DAA'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.0002 15.0012V16.0016"
                      stroke={pathname === 'Staking-Pack' ? 'white' : '#888DAA'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.2653 14.2869C10.5216 14.7276 10.9914 15.0005 11.5013 15.0049H12.5977C13.3069 15.0043 13.9045 14.4753 13.9912 13.7714C14.0778 13.0675 13.6263 12.4094 12.9384 12.2369L11.0634 11.7658C10.3755 11.5933 9.92398 10.9352 10.0106 10.2313C10.0973 9.52736 10.6949 8.99837 11.4041 8.9978H12.5005C13.0094 9.00133 13.4787 9.27292 13.7353 9.71238"
                      stroke={pathname === 'Staking-Pack' ? 'white' : '#888DAA'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.9998 2.99634C16.9725 2.99634 21.0036 7.02745 21.0036 12.0001C21.0036 16.9727 16.9725 21.0038 11.9998 21.0038C7.02721 21.0038 2.99609 16.9727 2.99609 12.0001C2.99609 7.02745 7.02721 2.99634 11.9998 2.99634"
                      stroke={pathname === 'Staking-Pack' ? 'white' : '#888DAA'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.9998 2.99634C16.9725 2.99634 21.0036 7.02745 21.0036 12.0001C21.0036 16.9727 16.9725 21.0038 11.9998 21.0038C7.02721 21.0038 2.99609 16.9727 2.99609 12.0001C2.99609 7.02745 7.02721 2.99634 11.9998 2.99634"
                      stroke={pathname === 'Staking-Pack' ? 'white' : '#888DAA'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {/* <Link
                    onClick={() => {
                      setIsOpen(false);
                      transparentLayerCtx.close();
                    }}
                    to="/Staking-Pack"
                    className={
                      `text-sm font-semibold ` +
                      (pathname === 'Staking-Pack' ? 'text-white' : 'text-gray-text')
                    }>
                    Staking Pack
                  </Link> */}
                </div>
                <div className="flex items-center gap-2 cursor-pointer">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <mask
                      id="path-1-inside-1_6246_22135"
                      fill={pathname === 'Network-Rewards' ? 'white' : '#888DAA'}>
                      <path d="M4.9506 16.9818L4.20711 17.0804L4.20718 17.081L4.9506 16.9818ZM4.69135 15.0265L5.43485 14.9279C5.41764 14.7981 5.36675 14.6751 5.28724 14.571L4.69135 15.0265ZM3.49409 13.46L2.89802 13.9152L2.89821 13.9154L3.49409 13.46ZM3.49409 10.5378L2.89847 10.082L2.89802 10.0826L3.49409 10.5378ZM4.69135 8.9731L5.28698 9.42888C5.36649 9.32497 5.41744 9.20205 5.43476 9.07235L4.69135 8.9731ZM4.9524 7.01774L4.20902 6.91835L4.209 6.91849L4.9524 7.01774ZM7.01924 4.95074L6.92056 4.20726L6.91981 4.20735L7.01924 4.95074ZM8.97266 4.69147L9.07134 5.43495C9.20112 5.41772 9.32413 5.36683 9.42814 5.28732L8.97266 4.69147ZM10.539 3.49411L10.0838 2.89807L10.0835 2.89827L10.539 3.49411ZM13.461 3.49411L13.9165 2.89827L13.9162 2.89807L13.461 3.49411ZM15.0273 4.69147L14.5718 5.28732C14.6757 5.3667 14.7985 5.41757 14.9281 5.43486L15.0273 4.69147ZM16.9826 4.95255L17.0824 4.20923L17.0818 4.20914L16.9826 4.95255ZM19.0494 7.01955L19.7929 6.92089L19.7927 6.91975L19.0494 7.01955ZM19.3086 8.97312L18.5652 9.07177C18.5824 9.20168 18.6334 9.32481 18.713 9.42888L19.3086 8.97312ZM20.5059 10.5378L21.102 10.0826L21.1015 10.082L20.5059 10.5378ZM20.5059 13.46L21.1018 13.9155L21.102 13.9152L20.5059 13.46ZM19.3086 15.0265L18.7128 14.571C18.6334 14.6749 18.5825 14.7977 18.5652 14.9272L19.3086 15.0265ZM19.0476 16.9819L18.3042 16.8826L19.0476 16.9819ZM16.9808 19.0506L17.0788 19.7942L17.0807 19.794L16.9808 19.0506ZM15.0273 19.3081L14.9293 18.5646C14.7991 18.5817 14.6757 18.6328 14.5714 18.7126L15.0273 19.3081ZM13.461 20.5073L13.9152 21.1041L13.9169 21.1028L13.461 20.5073ZM10.539 20.5073L10.0831 21.1028L10.0848 21.1041L10.539 20.5073ZM8.97266 19.3081L9.42858 18.7126C9.32464 18.633 9.20169 18.582 9.07194 18.5647L8.97266 19.3081ZM7.01744 19.047L7.11672 18.3036L7.11595 18.3035L7.01744 19.047ZM5.6941 16.8833L5.43485 14.9279L3.94786 15.125L4.20711 17.0804L5.6941 16.8833ZM5.28724 14.571L4.08998 13.0046L2.89821 13.9154L4.09547 15.4819L5.28724 14.571ZM4.09017 13.0048C3.63661 12.4109 3.63661 11.5869 4.09017 10.9929L2.89802 10.0826C2.03399 11.214 2.03399 12.7837 2.89802 13.9152L4.09017 13.0048ZM4.08972 10.9935L5.28698 9.42888L4.09573 8.51734L2.89847 10.082L4.08972 10.9935ZM5.43476 9.07235L5.69581 7.11699L4.209 6.91849L3.94795 8.87386L5.43476 9.07235ZM5.69579 7.11712C5.79484 6.37614 6.37772 5.79323 7.11868 5.69412L6.91981 4.20735C5.50818 4.39617 4.39773 5.50671 4.20902 6.91835L5.69579 7.11712ZM7.11792 5.69422L9.07134 5.43495L8.87398 3.94799L6.92056 4.20726L7.11792 5.69422ZM9.42814 5.28732L10.9945 4.08997L10.0835 2.89827L8.51718 4.09562L9.42814 5.28732ZM10.9942 4.09016C11.5881 3.63662 12.412 3.63662 13.0058 4.09016L13.9162 2.89807C12.7849 2.03398 11.2151 2.03398 10.0838 2.89807L10.9942 4.09016ZM13.0055 4.08997L14.5718 5.28732L15.4828 4.09562L13.9165 2.89827L13.0055 4.08997ZM14.9281 5.43486L16.8833 5.69595L17.0818 4.20914L15.1266 3.94807L14.9281 5.43486ZM16.8827 5.69587C17.6237 5.79542 18.2066 6.37832 18.3061 7.11935L19.7927 6.91975C19.6033 5.50873 18.4934 4.39878 17.0824 4.20923L16.8827 5.69587ZM18.3059 7.11821L18.5652 9.07177L20.0521 8.87445L19.7929 6.92089L18.3059 7.11821ZM18.713 9.42888L19.9103 10.9936L21.1015 10.082L19.9043 8.51734L18.713 9.42888ZM19.9098 10.993C20.3634 11.5869 20.3634 12.4109 19.9098 13.0048L21.102 13.9152C21.966 12.7838 21.966 11.214 21.102 10.0826L19.9098 10.993ZM19.91 13.0046L18.7128 14.571L19.9045 15.4819L21.1018 13.9155L19.91 13.0046ZM18.5652 14.9272L18.3042 16.8826L19.791 17.0811L20.052 15.1257L18.5652 14.9272ZM18.3042 16.8826C18.2052 17.6241 17.6222 18.2077 16.8808 18.3073L17.0807 19.794C18.4924 19.6042 19.6025 18.493 19.791 17.0811L18.3042 16.8826ZM16.8827 18.3071L14.9293 18.5646L15.1253 20.0517L17.0788 19.7942L16.8827 18.3071ZM14.5714 18.7126L13.0051 19.9117L13.9169 21.1028L15.4832 19.9036L14.5714 18.7126ZM13.0068 19.9105C12.4119 20.3632 11.5881 20.3632 10.9932 19.9105L10.0848 21.1041C11.2164 21.9653 12.7836 21.9653 13.9152 21.1041L13.0068 19.9105ZM10.9949 19.9117L9.42858 18.7126L8.51675 19.9036L10.0831 21.1028L10.9949 19.9117ZM9.07194 18.5647L7.11672 18.3036L6.91816 19.7904L8.87338 20.0515L9.07194 18.5647ZM7.11595 18.3035C6.3755 18.2054 5.79273 17.6231 5.69402 16.8827L4.20718 17.081C4.39543 18.4929 5.50681 19.6034 6.91893 19.7905L7.11595 18.3035Z" />
                    </mask>
                    <path
                      d="M4.9506 16.9818L4.20711 17.0804L4.20718 17.081L4.9506 16.9818ZM4.69135 15.0265L5.43485 14.9279C5.41764 14.7981 5.36675 14.6751 5.28724 14.571L4.69135 15.0265ZM3.49409 13.46L2.89802 13.9152L2.89821 13.9154L3.49409 13.46ZM3.49409 10.5378L2.89847 10.082L2.89802 10.0826L3.49409 10.5378ZM4.69135 8.9731L5.28698 9.42888C5.36649 9.32497 5.41744 9.20205 5.43476 9.07235L4.69135 8.9731ZM4.9524 7.01774L4.20902 6.91835L4.209 6.91849L4.9524 7.01774ZM7.01924 4.95074L6.92056 4.20726L6.91981 4.20735L7.01924 4.95074ZM8.97266 4.69147L9.07134 5.43495C9.20112 5.41772 9.32413 5.36683 9.42814 5.28732L8.97266 4.69147ZM10.539 3.49411L10.0838 2.89807L10.0835 2.89827L10.539 3.49411ZM13.461 3.49411L13.9165 2.89827L13.9162 2.89807L13.461 3.49411ZM15.0273 4.69147L14.5718 5.28732C14.6757 5.3667 14.7985 5.41757 14.9281 5.43486L15.0273 4.69147ZM16.9826 4.95255L17.0824 4.20923L17.0818 4.20914L16.9826 4.95255ZM19.0494 7.01955L19.7929 6.92089L19.7927 6.91975L19.0494 7.01955ZM19.3086 8.97312L18.5652 9.07177C18.5824 9.20168 18.6334 9.32481 18.713 9.42888L19.3086 8.97312ZM20.5059 10.5378L21.102 10.0826L21.1015 10.082L20.5059 10.5378ZM20.5059 13.46L21.1018 13.9155L21.102 13.9152L20.5059 13.46ZM19.3086 15.0265L18.7128 14.571C18.6334 14.6749 18.5825 14.7977 18.5652 14.9272L19.3086 15.0265ZM19.0476 16.9819L18.3042 16.8826L19.0476 16.9819ZM16.9808 19.0506L17.0788 19.7942L17.0807 19.794L16.9808 19.0506ZM15.0273 19.3081L14.9293 18.5646C14.7991 18.5817 14.6757 18.6328 14.5714 18.7126L15.0273 19.3081ZM13.461 20.5073L13.9152 21.1041L13.9169 21.1028L13.461 20.5073ZM10.539 20.5073L10.0831 21.1028L10.0848 21.1041L10.539 20.5073ZM8.97266 19.3081L9.42858 18.7126C9.32464 18.633 9.20169 18.582 9.07194 18.5647L8.97266 19.3081ZM7.01744 19.047L7.11672 18.3036L7.11595 18.3035L7.01744 19.047ZM5.6941 16.8833L5.43485 14.9279L3.94786 15.125L4.20711 17.0804L5.6941 16.8833ZM5.28724 14.571L4.08998 13.0046L2.89821 13.9154L4.09547 15.4819L5.28724 14.571ZM4.09017 13.0048C3.63661 12.4109 3.63661 11.5869 4.09017 10.9929L2.89802 10.0826C2.03399 11.214 2.03399 12.7837 2.89802 13.9152L4.09017 13.0048ZM4.08972 10.9935L5.28698 9.42888L4.09573 8.51734L2.89847 10.082L4.08972 10.9935ZM5.43476 9.07235L5.69581 7.11699L4.209 6.91849L3.94795 8.87386L5.43476 9.07235ZM5.69579 7.11712C5.79484 6.37614 6.37772 5.79323 7.11868 5.69412L6.91981 4.20735C5.50818 4.39617 4.39773 5.50671 4.20902 6.91835L5.69579 7.11712ZM7.11792 5.69422L9.07134 5.43495L8.87398 3.94799L6.92056 4.20726L7.11792 5.69422ZM9.42814 5.28732L10.9945 4.08997L10.0835 2.89827L8.51718 4.09562L9.42814 5.28732ZM10.9942 4.09016C11.5881 3.63662 12.412 3.63662 13.0058 4.09016L13.9162 2.89807C12.7849 2.03398 11.2151 2.03398 10.0838 2.89807L10.9942 4.09016ZM13.0055 4.08997L14.5718 5.28732L15.4828 4.09562L13.9165 2.89827L13.0055 4.08997ZM14.9281 5.43486L16.8833 5.69595L17.0818 4.20914L15.1266 3.94807L14.9281 5.43486ZM16.8827 5.69587C17.6237 5.79542 18.2066 6.37832 18.3061 7.11935L19.7927 6.91975C19.6033 5.50873 18.4934 4.39878 17.0824 4.20923L16.8827 5.69587ZM18.3059 7.11821L18.5652 9.07177L20.0521 8.87445L19.7929 6.92089L18.3059 7.11821ZM18.713 9.42888L19.9103 10.9936L21.1015 10.082L19.9043 8.51734L18.713 9.42888ZM19.9098 10.993C20.3634 11.5869 20.3634 12.4109 19.9098 13.0048L21.102 13.9152C21.966 12.7838 21.966 11.214 21.102 10.0826L19.9098 10.993ZM19.91 13.0046L18.7128 14.571L19.9045 15.4819L21.1018 13.9155L19.91 13.0046ZM18.5652 14.9272L18.3042 16.8826L19.791 17.0811L20.052 15.1257L18.5652 14.9272ZM18.3042 16.8826C18.2052 17.6241 17.6222 18.2077 16.8808 18.3073L17.0807 19.794C18.4924 19.6042 19.6025 18.493 19.791 17.0811L18.3042 16.8826ZM16.8827 18.3071L14.9293 18.5646L15.1253 20.0517L17.0788 19.7942L16.8827 18.3071ZM14.5714 18.7126L13.0051 19.9117L13.9169 21.1028L15.4832 19.9036L14.5714 18.7126ZM13.0068 19.9105C12.4119 20.3632 11.5881 20.3632 10.9932 19.9105L10.0848 21.1041C11.2164 21.9653 12.7836 21.9653 13.9152 21.1041L13.0068 19.9105ZM10.9949 19.9117L9.42858 18.7126L8.51675 19.9036L10.0831 21.1028L10.9949 19.9117ZM9.07194 18.5647L7.11672 18.3036L6.91816 19.7904L8.87338 20.0515L9.07194 18.5647ZM7.11595 18.3035C6.3755 18.2054 5.79273 17.6231 5.69402 16.8827L4.20718 17.081C4.39543 18.4929 5.50681 19.6034 6.91893 19.7905L7.11595 18.3035Z"
                      fill={pathname === 'Network-Rewards' ? 'white' : '#888DAA'}
                      stroke={pathname === 'Network-Rewards' ? 'white' : '#888DAA'}
                      strokeWidth="2"
                      mask="url(#path-1-inside-1_6246_22135)"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11.1036 8.0856C11.272 7.74422 11.6197 7.52808 12.0004 7.52808C12.3811 7.52808 12.7287 7.74422 12.8972 8.0856L13.406 9.11701C13.5516 9.41222 13.8332 9.61685 14.1589 9.66419L15.297 9.82961C15.6736 9.88439 15.9865 10.1482 16.1041 10.5101C16.2217 10.872 16.1238 11.2693 15.8514 11.535L15.0275 12.3386C14.792 12.5683 14.6845 12.8992 14.7401 13.2235L14.9345 14.3568C14.9988 14.7319 14.8446 15.111 14.5368 15.3347C14.2289 15.5585 13.8207 15.588 13.4838 15.411L12.4656 14.8759C12.1743 14.7228 11.8264 14.7228 11.5351 14.8759L10.5169 15.411C10.18 15.588 9.77183 15.5585 9.46395 15.3347C9.15606 15.111 9.00186 14.7319 9.06617 14.3568L9.26057 13.2235C9.31619 12.8992 9.20874 12.5683 8.97322 12.3386L8.14938 11.535C7.87699 11.2693 7.77903 10.872 7.89667 10.51C8.01432 10.1481 8.32718 9.88438 8.70376 9.82961L9.84189 9.66419C10.1676 9.61685 10.4492 9.41222 10.5948 9.11701L11.1036 8.0856Z"
                      stroke={pathname === 'Network-Rewards' ? 'white' : '#888DAA'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {/* <Link
                    onClick={() => {
                      setIsOpen(false);
                      transparentLayerCtx.close();
                    }}
                    to="/Network-Rewards"
                    className={
                      `text-sm font-semibold ` +
                      (pathname === 'Network-Rewards' ? 'text-white' : 'text-gray-text')
                    }>
                    Network Rewards
                  </Link> */}
                </div>
                <div className="text-[11px] font-bold pt-2 text-[#44485F] mt-5">DAO Government</div>
                <div className="flex items-center gap-2 cursor-pointer">
                  <svg
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <circle
                      cx="12.5"
                      cy="12"
                      r="8.25"
                      stroke={pathname === 'Buy-Governance-Token' ? 'white' : '#888DAA'}
                      strokeWidth="1.5"
                    />
                    <path
                      d="M15.4138 15.4092L15.3708 14.5046C15.3492 14.6123 15.299 14.72 15.22 14.8277C15.1482 14.9354 15.0513 15.0323 14.9292 15.1185C14.8144 15.2046 14.6744 15.2764 14.5092 15.3338C14.3441 15.3841 14.1574 15.4092 13.9492 15.4092H10.8046C10.3451 15.4092 9.96462 15.3733 9.66308 15.3015C9.36872 15.2226 9.13538 15.0897 8.96308 14.9031C8.79077 14.7164 8.66872 14.4723 8.59692 14.1708C8.53231 13.8621 8.5 13.4744 8.5 13.0077V10.4015C8.5 9.95641 8.53231 9.58308 8.59692 9.28154C8.66872 8.97282 8.79077 8.72513 8.96308 8.53846C9.13538 8.34462 9.36872 8.20821 9.66308 8.12923C9.96462 8.04308 10.3451 8 10.8046 8H14.5631C14.8359 8 15.0728 8.03949 15.2738 8.11846C15.4749 8.19026 15.6472 8.28359 15.7908 8.39846C15.9344 8.50615 16.0492 8.62462 16.1354 8.75385C16.2215 8.8759 16.2862 8.98718 16.3292 9.08769L15.4138 10.0354C15.3421 9.89179 15.2379 9.76256 15.1015 9.64769C14.9651 9.52564 14.7533 9.46462 14.4662 9.46462H10.8154C10.4779 9.46462 10.2482 9.52923 10.1262 9.65846C10.0041 9.78769 9.94308 10.0354 9.94308 10.4015V12.7923C9.94308 13.0508 9.95385 13.2554 9.97538 13.4062C10.0041 13.5569 10.0508 13.6754 10.1154 13.7615C10.1872 13.8405 10.2769 13.8944 10.3846 13.9231C10.4995 13.9446 10.6431 13.9554 10.8154 13.9554H14.1862C14.5954 13.9554 14.879 13.8979 15.0369 13.7831C15.1949 13.661 15.2738 13.4851 15.2738 13.2554V12.3077H12.4954V11.1015H16.6415V15.4092H15.4138Z"
                      fill={pathname === 'Buy-Governance-Token' ? 'white' : '#888DAA'}
                    />
                  </svg>
                  {/* <Link
                    onClick={() => {
                      setIsOpen(false);
                      transparentLayerCtx.close();
                    }}
                    to="/Buy-Governance-Token"
                    className={
                      `text-sm font-semibold ` +
                      (pathname === 'Buy-Governance-Token' ? 'text-white' : 'text-gray-text')
                    }>
                    Buy Governance Token
                  </Link> */}
                </div>
                <div className="flex items-center gap-2 cursor-pointer">
                  <svg
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12.5 15L16 11.5"
                      stroke={pathname === 'Profits-Dashboard' ? 'white' : '#888DAA'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20.8 18C21.2 17 21.5 15.8 21.5 14.6C21.5 9.8 17.5 6 12.5 6C7.5 6 3.5 9.8 3.5 14.6C3.5 15.8 3.8 17 4.2 18"
                      stroke={pathname === 'Profits-Dashboard' ? 'white' : '#888DAA'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {/* <Link
                    onClick={() => {
                      setIsOpen(false);
                      transparentLayerCtx.close();
                    }}
                    to="/Profits-Dashboard"
                    className={
                      `text-sm font-semibold ` +
                      (pathname === 'Profits-Dashboard' ? 'text-white' : 'text-gray-text')
                    }>
                    Profits Dashboard
                  </Link> */}
                </div>
                <div className="flex items-center gap-2 cursor-pointer">
                  <svg
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M18.5 18.8597H17.74C16.94 18.8597 16.18 19.1697 15.62 19.7297L13.91 21.4198C13.13 22.1898 11.86 22.1898 11.08 21.4198L9.37 19.7297C8.81 19.1697 8.04 18.8597 7.25 18.8597H6.5C4.84 18.8597 3.5 17.5298 3.5 15.8898V4.97974C3.5 3.33974 4.84 2.00977 6.5 2.00977H18.5C20.16 2.00977 21.5 3.33974 21.5 4.97974V15.8898C21.5 17.5198 20.16 18.8597 18.5 18.8597Z"
                      stroke={pathname === 'Voting-Chain' ? 'white' : '#888DAA'}
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.5 9.15979C7.5 8.22979 8.26 7.46973 9.19 7.46973C10.12 7.46973 10.88 8.22979 10.88 9.15979C10.88 11.0398 8.21 11.2398 7.62 13.0298C7.5 13.3998 7.81 13.7698 8.2 13.7698H10.88"
                      stroke={pathname === 'Voting-Chain' ? 'white' : '#888DAA'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.5398 13.7599V8.04991C16.5398 7.78991 16.3698 7.55985 16.1198 7.48985C15.8698 7.41985 15.5998 7.51985 15.4598 7.73985C14.7398 8.89985 13.9598 10.2199 13.2798 11.3799C13.1698 11.5699 13.1698 11.8199 13.2798 12.0099C13.3898 12.1999 13.5998 12.3198 13.8298 12.3198H17.4998"
                      stroke={pathname === 'Voting-Chain' ? 'white' : '#888DAA'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {/* <Link
                    onClick={() => {
                      setIsOpen(false);
                      transparentLayerCtx.close();
                    }}
                    to="/Voting-Chain"
                    className={
                      `text-sm font-semibold ` +
                      (pathname === 'Voting-Chain' ? 'text-white' : 'text-gray-text')
                    }>
                    Voting Chain
                  </Link> */}
                </div>
                <div className="flex items-center gap-2 cursor-pointer">
                  <svg
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M5.43642 5.97119C4.37442 7.06119 3.60342 8.43119 3.23242 9.95919"
                      stroke={pathname === 'Referral-Program' ? 'white' : '#888DAA'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.78906 20.4432C10.3801 20.5712 10.9931 20.6422 11.6231 20.6422C12.5151 20.6422 13.3761 20.5062 14.1861 20.2552"
                      stroke={pathname === 'Referral-Program' ? 'white' : '#888DAA'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.23438 14.041C3.60537 15.569 4.37637 16.939 5.43837 18.029"
                      stroke={pathname === 'Referral-Program' ? 'white' : '#888DAA'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19.9054 14.4639C19.4864 15.8759 18.7124 17.1329 17.6934 18.1419"
                      stroke={pathname === 'Referral-Program' ? 'white' : '#888DAA'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17.6934 5.85791C18.7124 6.86691 19.4854 8.12391 19.9054 9.53591"
                      stroke={pathname === 'Referral-Program' ? 'white' : '#888DAA'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.78906 3.55726C10.3801 3.42926 10.9931 3.35826 11.6231 3.35826C12.5151 3.35826 13.3761 3.49426 14.1861 3.74526"
                      stroke={pathname === 'Referral-Program' ? 'white' : '#888DAA'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22.0334 10.2322C23.0097 11.2085 23.0097 12.7915 22.0334 13.7678C21.0571 14.7441 19.4742 14.7441 18.4979 13.7678C17.5215 12.7915 17.5215 11.2085 18.4979 10.2322C19.4742 9.25592 21.0571 9.25592 22.0334 10.2322"
                      stroke={pathname === 'Referral-Program' ? 'white' : '#888DAA'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.32636 17.5691C10.3027 18.5455 10.3027 20.1284 9.32636 21.1047C8.35005 22.081 6.76714 22.081 5.79083 21.1047C4.81452 20.1284 4.81452 18.5455 5.79083 17.5691C6.76714 16.5928 8.35005 16.5928 9.32636 17.5691"
                      stroke={pathname === 'Referral-Program' ? 'white' : '#888DAA'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.32636 2.89532C10.3027 3.87163 10.3027 5.45454 9.32636 6.43085C8.35005 7.40716 6.76714 7.40716 5.79083 6.43085C4.81452 5.45454 4.81452 3.87163 5.79083 2.89532C6.76714 1.91901 8.35005 1.91901 9.32636 2.89532"
                      stroke={pathname === 'Referral-Program' ? 'white' : '#888DAA'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  {/* <Link
                    onClick={() => {
                      setIsOpen(false);
                      transparentLayerCtx.close();
                    }}
                    to="/Referral-Program"
                    className={
                      `text-sm font-semibold ` +
                      (pathname === 'Referral-Program' ? 'text-white' : 'text-gray-text')
                    }>
                    Referral Program
                  </Link> */}
                </div>
                {authCtx && authCtx.user && authCtx.jwt !== 'logged_out' && connectedAccountAddress ? (
                  <>
                    <div className="text-[11px] font-bold pt-2 text-[#44485F] mt-5">
                      WILL YOU GET OUT?
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer mb-10">
                      <svg
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M9.5 21H5.5C4.96957 21 4.46086 20.7893 4.08579 20.4142C3.71071 20.0391 3.5 19.5304 3.5 19V5C3.5 4.46957 3.71071 3.96086 4.08579 3.58579C4.46086 3.21071 4.96957 3 5.5 3H9.5"
                          stroke="#888DAA"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16.5 17L21.5 12L16.5 7"
                          stroke="#888DAA"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21.5 12H9.5"
                          stroke="#888DAA"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-sm font-semibold text-gray-text" onClick={handleLogout}>
                        Logout
                      </span>
                    </div>
                  </>
                ) : (
                  <SidebarConnect />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmallSidebar;
