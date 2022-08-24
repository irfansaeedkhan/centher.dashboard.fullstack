import { connect } from 'react-redux'
import { testSetValue, testGetValue } from '../../../redux/action/test'

const Count1 = (props)=>{
    
    console.log("Test1 props ",props)
    return(
        <div>
            <h1>
                Count Test V1 : <span>{props.value1}</span>
            </h1>
            <h1>
                Count Test V2 : <span>{props.value2}</span>
            </h1>
            efwefwefwe
            <button onClick={() => props.increment({value1:10})}>Set</button>
            <button onClick={() => props.decrement()}>Get</button>
        </div>
    )
}
const mapStateToProps = (state) => {
	return { ...state.test };
}
const mapDispatchToProps = (dispatch) => ({
	increment: (int) => dispatch(testSetValue('TEST_SET', { value1: int })),
	decrement: (int) => dispatch(testGetValue('TEST_GET', { value1: int }))
})

export default connect(mapStateToProps, mapDispatchToProps)(Count1)
