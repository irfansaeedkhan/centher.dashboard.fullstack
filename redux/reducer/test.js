import {testActionType} from "../action/test";

const initialStates = {
    value1:-1,
    value2:0
};
const testReducer = (state = initialStates, action)=>{
    console.log("test reducer action : ",action)
    console.log("test reducer state : ",state)
    switch(action.type){
        case testActionType.TEST_GET:return{
            ...state
        }
        case testActionType.TEST_SET:return{
            ...state,
            value1:action.value1
        }
        default:
            return state
    }
}

module.exports.testReducer = testReducer;
module.exports.initialStates = initialStates;