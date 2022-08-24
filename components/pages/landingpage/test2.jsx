import { connect } from 'react-redux'
import { testSetValue, testGetValue } from '../../../redux/action/test'

let reduxData = null;
const Test2 = (props)=>{
    console.log(reduxData)
    console.log("Test2 ",props)
    return(
        <div>
            <h1>
                TEST Test V1 : <span>{props.value1}</span>
            </h1>
            <h1>
                TEST Test V2 : <span>{props.value2}</span>
            </h1>
            <div></div>
        </div>
    )
}
const mapStateToProps = (state) => {
	return { ...state.test };
}

const mapDispatchToProps = (dispatch) => ({
	increment: (int) => dispatch(testSetValue('TEST_SET', { value1: int })),
	decrement: (int) => dispatch(testGetValue('TEST_GET', { value2: int }))
})

export default connect(mapStateToProps, mapDispatchToProps)(Test2)