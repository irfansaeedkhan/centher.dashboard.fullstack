import React from 'react';
import wallet from '../../../../public/images/wallet.png';
import meta from '../../../../public/images/meta.png';
import bin from '../../../../public/images/bin.png';

const ConnecModal = ({
  setConnectModalState,
  selectedWallet,
  setSelectedWallet,
  loginWithMetamask
}) => {
  return (
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
              onClick={() => setConnectModalState(false)}>
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
                (selectedWallet === 'MetaMask' ? '  bordersetyellow ' : '')
              }
              onClick={() => setSelectedWallet('MetaMask')}>
              <span className="text-white">MetaMask</span>
              <img src={meta} alt="meta" />
            </button>
            <button
              className="w-full flex items-center justify-between p-3 rounded-lg text-left focus:outline-none focus:border-yellow-theme focus:ring-1 focus:ring-yellow-theme"
              onClick={() => setSelectedWallet('Binance')}>
              <span className="text-white">Binance Chain Wallet</span>
              <img src={bin} alt="bin" />
            </button>
            <button
              className="w-full flex items-center justify-between p-3 rounded-lg text-left focus:outline-none focus:border-yellow-theme focus:ring-1 focus:ring-yellow-theme"
              onClick={() => setSelectedWallet('Wallet')}>
              <span className="text-white">Wallet Connect</span>
              <img src={wallet} alt="wallet" />
            </button>
          </div>
          <div className="flex w-full gap-5 sm:gap-0 justify-between xl:mt-5 lg:mt-5 md:mt-5 sm:mt-4 xl:flex-row lg:flex-row  md:flex-row sm:flex-col">
            {selectedWallet === 'MetaMask' ? (
              <button
                className="w-full bg-yellow-theme rounded-lg px-4 py-3 font-bold text-black-shade-2 hover:bg-gray-shade-3 hover:text-yellow-theme "
                onClick={(e) => loginWithMetamask(e)}>
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
  );
};

export default ConnecModal;
