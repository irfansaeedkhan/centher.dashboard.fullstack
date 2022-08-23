import React, { useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import Link from 'next/link';
import audio from '../../../public/images/audio.png';
import video from '../../../public/images/video1.png';
import axios from '../../../utils/axios';

const Search = () => {
  const [showSearch, setshowSearch] = useState(false);
  const [searchShow, setSearchShow] = useState(false);
  const [searchShowLarge, setSearchShowLarge] = useState(false);
  const [APIData, setAPIData] = useState([]);

  const handleChange = (e) => {
    if (e.target.value.trim() == '') {
      setSearchShow(false);
      return;
    }
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/nfts/search?q=${e.target.value.trim()}`)
      .then((response) => {
        setAPIData(response.data.results);
        if (e.target.value.trim() == '') {
          setSearchShow(false);
        } else {
          setSearchShow(true);
        }
      });
  };

  const handleChangeLarge = (e) => {
    if (e.target.value.trim() == '') {
      setSearchShowLarge(false);
      return;
    }
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/nfts/search?q=${e.target.value.trim()}`)
      .then((response) => {
        setAPIData(response.data.results);
        if (e.target.value.trim() == '') {
          setSearchShowLarge(false);
        } else {
          setSearchShowLarge(true);
        }
      });
  };

  return (
    <div>
      <span
        className="text-2xl text-yellow-theme md:hidden sm:flex cursor-pointer dynamicTrans"
        onClick={() => setshowSearch(true)}>
        <BiSearch />
      </span>
      <div className="relative">
        <div className="flex gap-2 items-center bg-[#1E212B] xl:max-w-[500px] xl:min-w-[400px] w-auto  lg:max-w-[400px] lg:min-w-[300px] md:max-w-[300px] md:min-w-[200px] h-[44px] p-3 rounded-xl md:flex sm:hidden ">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.8">
              <path
                d="M15.7143 6.83804C16.8913 8.01507 17.5526 9.61146 17.5526 11.276C17.5526 12.9406 16.8913 14.537 15.7143 15.714C14.5372 16.8911 12.9409 17.5523 11.2763 17.5523C9.61171 17.5523 8.01531 16.8911 6.83828 15.714C5.66125 14.537 5 12.9406 5 11.276C5 9.61146 5.66125 8.01507 6.83828 6.83804C8.01531 5.661 9.61171 4.99976 11.2763 4.99976C12.9409 4.99976 14.5372 5.661 15.7143 6.83804"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.0009 19.0001L15.7109 15.7101"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
          <input
            type="search"
            placeholder="Search"
            className="focus:outline-none p-0 focus:ring-0 w-full text-white bg-transparent border-0"
            onChange={handleChangeLarge}
          />
        </div>
        {searchShowLarge && (
          <div className="absolute z-50 w-full">
            {APIData.nfts.length > 0 && (
              <div
                className="bordersetall bg-black-shade-3 w-full  py-4  flex flex-col z-50 overflow-y-scroll mt-2"
                style={{ maxHeight: '300px' }}>
                <span className="px-3 font-semibold text-white">NFTs</span>
                {/* {APIData.nfts.map((N) => {
                  return (
                    <Link key={N._id} to={`/nfts/${N._id}`}>
                      <div className="flex gap-2 items-center px-3 py-3 hover:bg-gray-shade-3">
                        {N.file_format == 'audio' ? (
                          <img
                            src={audio}
                            alt={N.name}
                            className="text-xs rounded-full"
                            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                          />
                        ) : N.file_format == 'video' ? (
                          <img
                            src={video}
                            alt={N.name}
                            className="text-xs rounded-full"
                            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                          />
                        ) : (
                          <img
                            src={`https://nethernft.infura-ipfs.io/ipfs/${N.file_hash}`}
                            alt={N.name}
                            className="text-xs rounded-full"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                        )}
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-transparent bg-clip-text font-semibold anim">
                            {N.name}
                          </span>
                          <span className="text-white text-xs">
                            {N.auto_generated_nft ? N.token_name.slice(0, -15) : N.token_name}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })} */}
              </div>
            )}
            {APIData.influencers.length > 0 && (
              <div
                className="bordersetall bg-black-shade-3 w-full py-4  flex flex-col overflow-y-scroll mt-2"
                style={{ maxHeight: '300px' }}>
                <span className="px-3 font-semibold text-white">Influencers</span>
                {/* {APIData.influencers.map((N) => {
                  return (
                    <Link key={N._id} to={`/influencers/${N.account_address}`}>
                      <div className="flex gap-2 items-center px-3 py-3 hover:bg-gray-shade-3">
                        {N.custom_image == true ? (
                          <img
                            src={N.profile_image}
                            alt={N.name}
                            className="text-xs rounded-full"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                        ) : N.custom_image == false ? (
                          <img
                            src={`${process.env.REACT_APP_API_URL}/${N.profile_image}`}
                            alt={N.name}
                            className="text-xs rounded-full"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                        ) : (
                          <img
                            src={`${process.env.REACT_APP_API_URL}/${N.profile_image}`}
                            alt={N.name}
                            className="text-xs rounded-full"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                        )}
                        <div className="flex flex-col gap-1">
                          {N.first_name ? (
                            <span className="text-sm text-transparent bg-clip-text font-semibold anim">
                              {N.first_name} {N.last_name}
                            </span>
                          ) : (
                            <span className="text-sm text-transparent bg-clip-text font-semibold anim">
                              {N.name}
                            </span>
                          )}
                          <span className="text-white text-xs">
                            {N?.account_address?.slice(0, 3) +
                              '...' +
                              N?.account_address?.slice(39, 42)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })} */}
              </div>
            )}
          </div>
        )}
      </div>
      {showSearch && (
        <div className="justify-center items-center px-7 flex overflow-x-hidden overflow-y-scroll fixed inset-0 z-50 outline-none focus:outline-none backdrop-filter backdrop-blur-lg font-monto">
          {/* <div className="relative lg:p-4 xl:p-4 sm:p-4 md:p-4 "> */}
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-black-shade-1 outline-none focus:outline-none lg:p-6 xl:p-6 md:p-6 sm:p-4  lg:w-120 xl:w-120 sm:w-full md:w-120 w-full">
            {/*header*/}
            <div className="flex  flex-wrap-reverse items-center justify-between rounded-t xl:mb-6 lg:mb-6 md:mb-6 sm:mb-2">
              <h3 className="  text-transparent bg-clip-text text-34 font-semibold anim">Search</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-white opacity-100 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setshowSearch(false)}>
                <span className="bg-transparent text-white opacity-100 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="flex flex-col w-full ">
              <input
                type="search"
                placeholder="Search"
                className="bg-transparent w-full px-2 py-3 bordersetall focus:outline-none text-white"
                onChange={handleChange}
              />
              {searchShow && (
                <>
                  {APIData.nfts.length > 0 && (
                    <div
                      className="bordersetall bg-black-shade-3 w-full  py-4  flex flex-col z-50 overflow-y-scroll mt-2"
                      style={{ maxHeight: '300px' }}>
                      <span className="px-3 font-semibold text-white">NFTs</span>
                      {/* {APIData.nfts.map((N) => {
                        return (
                          <Link key={N._id} to={`/nfts/${N._id}`}>
                            <div className="flex gap-2 items-center px-3 py-3 hover:bg-gray-shade-3">
                              {N.file_format == 'audio' ? (
                                <img
                                  src={audio}
                                  alt={N.name}
                                  className="text-xs rounded-full"
                                  style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                                />
                              ) : N.file_format == 'video' ? (
                                <img
                                  src={video}
                                  alt={N.name}
                                  className="text-xs rounded-full"
                                  style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                                />
                              ) : (
                                <img
                                  src={`https://nethernft.infura-ipfs.io/ipfs/${N.file_hash}`}
                                  alt={N.name}
                                  className="text-xs rounded-full"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                              )}
                              <div className="flex flex-col gap-1">
                                <span className="text-sm text-transparent bg-clip-text font-semibold anim">
                                  {N.name}
                                </span>
                                <span className="text-white text-xs">
                                  {N.auto_generated_nft ? N.token_name.slice(0, -15) : N.token_name}
                                </span>
                              </div>
                            </div>
                          </Link>
                        );
                      })} */}
                    </div>
                  )}
                  {APIData.influencers.length > 0 && (
                    <div
                      className="bordersetall bg-black-shade-3 w-full  py-4  flex flex-col z-50 overflow-y-scroll mt-2"
                      style={{ maxHeight: '300px' }}>
                      <span className="px-3 font-semibold text-white">Influencers</span>
                      {/* {APIData.influencers.map((N) => {
                        return (
                          <Link key={N._id} to={`/influencers/${N.account_address}`}>
                            <div className="flex gap-2 items-center px-3 py-3 hover:bg-gray-shade-3">
                              {N.custom_image == true ? (
                                <img
                                  src={N.profile_image}
                                  alt={N.name}
                                  className="text-xs rounded-full"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                              ) : N.custom_image == false ? (
                                <img
                                  src={`${process.env.REACT_APP_API_URL}/${N.profile_image}`}
                                  alt={N.name}
                                  className="text-xs rounded-full"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                              ) : (
                                <img
                                  src={`${process.env.REACT_APP_API_URL}/${N.profile_image}`}
                                  alt={N.name}
                                  className="text-xs rounded-full"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                              )}
                              <div className="flex flex-col gap-1">
                                {N.first_name ? (
                                  <span className="text-sm text-transparent bg-clip-text font-semibold anim">
                                    {N.first_name} {N.last_name}
                                  </span>
                                ) : (
                                  <span className="text-sm text-transparent bg-clip-text font-semibold anim">
                                    {N.name}
                                  </span>
                                )}
                                <span className="text-white text-xs">
                                  {N?.account_address?.slice(0, 3) +
                                    '...' +
                                    N?.account_address?.slice(39, 42)}
                                </span>
                              </div>
                            </div>
                          </Link>
                        );
                      })} */}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
