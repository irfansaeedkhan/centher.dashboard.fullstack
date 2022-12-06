import React from "react";

interface SingleLiscenseProps {
  no: number;
}

const SingleLiscense: React.FC<SingleLiscenseProps> = ({ no }) => {
  return (
    <div className="w-full mt-4">
      <div
        className={`p-8 flex items-center rounded-t-[14px] gap-2 bg-[url(/images/liscense${no}.png)] bg-cover bg-no-repeat bg-center`}
      >
        <h6 className="text-white text-xl font-semibold">Liscense {no}</h6>
        <p className="py-1 px-2 border border-[#50C24C] bg-transparent text-[#50C24C] text-xs font-semibold rounded-lg">
          Activated
        </p>
      </div>
      <div className="bg-elevation-1 p-8 flex gap-2">
        <p className="text-gray-shade-7 font-semibold text-sm w-full max-w-[200px]">
          Level
        </p>
        <div className="flex-grow overflow-x-scroll flex gap-10">
          <p className="w-full max-w-[58px] text-sm font-semibold text-white">
            01
          </p>
          <p className="w-full max-w-[58px] text-sm font-semibold text-white">
            02
          </p>
          <p className="w-full max-w-[58px] text-sm font-semibold text-white">
            03
          </p>
          <p className="w-full max-w-[58px] text-sm font-semibold text-white">
            04
          </p>
          <p className="w-full max-w-[58px] text-sm font-semibold text-white">
            05
          </p>
          <p className="w-full max-w-[58px] text-sm font-semibold text-white">
            06
          </p>
          <p className="w-full max-w-[58px] text-sm font-semibold text-white">
            07
          </p>
          <p className="w-full max-w-[58px] text-sm font-semibold text-white">
            08
          </p>
        </div>
      </div>
      <div className="bg-elevation-1 p-8 flex gap-2 rounded-b-[14px]">
        <p className="text-gray-shade-7 font-semibold text-sm w-full max-w-[200px]">
          Branze Network License
        </p>
        <div className="flex-grow overflow-x-scroll flex gap-10">
          <p className="w-full max-w-[58px] text-sm font-semibold text-white">
            0.03
          </p>
          <p className="w-full max-w-[58px] text-sm font-semibold text-white">
            0.015
          </p>
          <p className="w-full max-w-[58px] text-sm font-semibold text-white">
            --
          </p>
          <p className="w-full max-w-[58px] text-sm font-semibold text-white">
            --
          </p>
          <p className="w-full max-w-[58px] text-sm font-semibold text-white">
            --
          </p>
          <p className="w-full max-w-[58px] text-sm font-semibold text-white">
            --
          </p>
          <p className="w-full max-w-[58px] text-sm font-semibold text-white">
            --
          </p>
          <p className="w-full max-w-[58px] text-sm font-semibold text-white">
            --
          </p>
        </div>
      </div>
    </div>
  );
};

export default SingleLiscense;
