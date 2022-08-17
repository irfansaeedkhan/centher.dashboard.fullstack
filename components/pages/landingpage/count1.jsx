import { useSelector, useDispatch } from 'react-redux'
import { testSetValue, testGetValue } from '../../../redux/action/test'
const Count1 = ()=>{
    const counter = useSelector((state) => state.value1)
    const dispatch = useDispatch()

    return(
        <div>
            <h1>
                Count: <span>{counter}</span>
            </h1>
            <button onClick={() => dispatch(testSetValue({value1:10}))}>Set</button>
            <button onClick={() => dispatch(testGetValue())}>Get</button>
        </div>
    )
}

export default Count1;