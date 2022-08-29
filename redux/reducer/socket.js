import {socketActionType} from "../action/socket"

const initialStates = {
    soketconn:null,
    connected:true
}

const socketReducer = (state=initialStates, action)=>{
    switch(action.type){
        case socketActionType.SOCKET_CONNECT: return{
            ...state,
            soketconn:action.payload.soketconn,
            connected:true
        }
        case socketActionType.SOCKET_DISCONNECT: return{
            soketconn:null,
            connected:false
        }
        case socketActionType.SOCKET_GET: return{
            ...state
        }
        default:{
            return state
        }
    }
}