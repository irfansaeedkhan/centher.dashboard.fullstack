import axios from 'axios';
import axiosRetry from 'axios-retry';
import Router from "next/router";

const retryDelayTimeInMilliSeconds = 2000;

axiosRetry(axios, {
    retries: 6,
    retryDelay: (retryCount) => {
      return retryCount * retryDelayTimeInMilliSeconds;
    },
    retryCondition: (error) => {
        //Running retry when getting 401 error status
        return error.response.status === 401;
    },
});

axios.interceptors.request.use(async (req)=>{
    try{
        return req;
    }catch(e){
        return req;
    }
},
(err)=>{
    //
    
    throw err;
})

axios.interceptors.response.use(async (response)=>{
    try{
        return response;
    }catch(e){
        return response;
    }
},
(err)=>{
    if (err.response!=null&&err.response.status) {
        if(err.response.data.error=="Invalid login"){
            Router.push("/logout");
        }
    }
    throw err;
})

export default axios;