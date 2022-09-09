/* eslint-disable @next/next/no-img-element */
// React, Next, NPM Packages
import React, { useState } from "react";

// App imports
import { useAvatars } from "@/hooks/use.avatars";
import { Avatar } from "@/models/avatars";
import { NODE_API_URL } from "@/constants/common";

const Avatars: React.FC = () => {
  const { avatars } = useAvatars();
  const [avatarModal, setAvatarModal] = useState(false);
  const [profileImage, setProfileImage] = useState<Avatar["name"]>();

  return (
    <div className="flex gap-2 items-center">
      {profileImage !== undefined ? (
        <img
          src={`${NODE_API_URL}/${profileImage}`}
          className="bg-gray-shade-3 rounded-full"
          style={{ width: "80px", height: "80px", objectFit: "cover" }}
          alt="Profile Image"
        />
      ) : (
        <img
          src="/images/a1.png"
          className="bg-gray-shade-3 rounded-full"
          style={{ width: "80px", height: "80px", objectFit: "cover" }}
          alt="Profile Image"
        />
      )}
      <button
        className="bg-yellow-theme px-3 py-2 rounded-lg font-bold text-black"
        onClick={() => setAvatarModal(true)}
      >
        Profile Image
      </button>
      {avatarModal && (
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
                    setAvatarModal(false);
                  }}
                >
                  <span className="bg-transparent text-white opacity-100 h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>
              <div
                className="scrollSet overflow-y-scroll"
                style={{ maxHeight: "400px" }}
              >
                <div className="w-full flex gap-4 items-center justify-center flex-wrap ">
                  {avatars.map((avatar) => {
                    return (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={avatar.path}
                        src={`${NODE_API_URL}/${avatar.path}`}
                        alt={avatar.name}
                        className="cursor-pointer rounded-full bg-gray-shade-3"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                        onClick={() => {
                          setAvatarModal(false);
                          setProfileImage(avatar.path);
                          // setSignup((prev) => {
                          //   return {
                          //     ...prev,
                          //     profile_image: avatar.path,
                          //   };
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
    </div>
  );
};

export default Avatars;
