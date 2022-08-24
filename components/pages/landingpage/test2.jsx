import { useSelector, useDispatch } from 'react-redux';
import { testSetValue, testGetValue } from '../../../redux/action/test'

const Test2 = ()=>{
    const counter = useSelector((state) => state.value1)
    console.log("Counter : ",counter)
    const dispatch = useDispatch()

    return(
        <div>
            <div>Count in second component </div>
            <div>{counter}</div>
        </div>
    )
}

export default Test2;