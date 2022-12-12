import React from "react";
import SingleLiscense from "./single.liscense";

const LiscenseSection = () => {
  return (
    <div className="my-12 space-y-3">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-semibold mb-6 text-white">Licenses</div>
        <button className="text-gray-shade-8 text-sm font-bold py-3 w-full max-w-[200px] bg-black-shade-7 rounded-xl">
          Upgrade License
        </button>
      </div>
      <SingleLiscense no={1} />
      <SingleLiscense no={2} />
      <SingleLiscense no={3} />
    </div>
  );
};

export default LiscenseSection;
