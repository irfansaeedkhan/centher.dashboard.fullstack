import { connect } from 'react-redux'
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
import {setWeb3Data, disconnectWeb3, getAllValues} from "../../redux/action/web3"

const PublicHeader = (props) => {
  return(
    <div>
      <SmallSidebar></SmallSidebar>
    </div>
  )
};

const mapStateToProps = (state) => {
	return { ...state.test };
}

const mapDispatchToProps = (dispatch) => ({
	connectToWeb3: (web3ConData) => dispatch(setWeb3Data('TEST_SET', { ...web3ConData })),
	disconnectToWeb3: () => dispatch(disconnectWeb3('TEST_GET', {})),
  geWeb3Conn: () => dispatch(disconnectWeb3('TEST_GET', {}))
})

export default connect(mapStateToProps, mapDispatchToProps)(PublicHeader)
