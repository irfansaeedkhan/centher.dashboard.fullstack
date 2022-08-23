import React, { useEffect, useState } from 'react';
import axios from '../../../../utils/axios';
import a1 from '../../../../public/images/a1.png';
import { toast } from 'react-toastify';

const RegisterModal = ({
  setConnectModalState,
  web3,
  setRegisterModalState,
  loginWithMetamask,
  signup,
  setSignup,
  referrer
}) => {
  const [showAvatarModalState, setshowAvatarModalState] = useState(false);
  const [avatarsList, setAvatarsList] = useState([]);
  const [profileImage, setProfileImage] = useState();

  useEffect(() => {
    (async () => {
      try {
        const promise2 = axios.get(`${process.env.REACT_APP_API_URL}/api/public/avatars.json`);

        const [avatars] = await Promise.all([promise2]);

        setAvatarsList(avatars.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  async function handleSubmitSignup(e) {
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
      setRegisterModalState(false);
      setConnectModalState(true);
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
  }

  return (
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-scroll fixed inset-0 z-50 outline-none focus:outline-none backdrop-filter backdrop-blur-lg font-monto">
      <div className="relative lg:p-4 xl:p-4 sm:p-4 md:p-4 p-12">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-black-shade-1 outline-none focus:outline-none lg:p-6 xl:p-6 md:p-6 sm:p-4  lg:w-120 xl:w-120 sm:w-full md:w-120 w-full mt-80">
          <div className="flex  flex-wrap-reverse items-center justify-between rounded-t xl:mb-6 lg:mb-6 md:mb-6 sm:mb-2">
            <h3 className="  text-transparent bg-clip-text text-34 font-semibold anim">Register</h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-white opacity-100 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={() => setRegisterModalState(false)}>
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
                onClick={() => setshowAvatarModalState(true)}>
                Profile Image
              </button>
            </div>
            {showAvatarModalState && (
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
                          setshowAvatarModalState(false);
                        }}>
                        <span className="bg-transparent text-white opacity-100 h-6 w-6 text-2xl block outline-none focus:outline-none">
                          ×
                        </span>
                      </button>
                    </div>
                    <div className="scrollSet overflow-y-scroll" style={{ maxHeight: '400px' }}>
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
                                setshowAvatarModalState(false);
                                setProfileImage(avatar.path);
                                // setSignup((prev) => {
                                //   return { ...prev, profile_image: avatar.name };
                                // });
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
  );
};

export default RegisterModal;
