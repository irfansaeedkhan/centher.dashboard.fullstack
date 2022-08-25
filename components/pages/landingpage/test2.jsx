import { connect } from 'react-redux'
import { testSetValue, testGetValue } from '../../../redux/action/test'

let reduxData = null;
const Test2 = (props)=>{
    console.log(reduxData)
    console.log("Test2 ",props)
    return(
        <div>
            <h1>
                Web3wallet test name : <span>{props.web3.walletname}</span>
            </h1>
            <h1>
                Web3 User test address : <span>{props.web3.useraddress}</span>
            </h1>
            <div></div>
        </div>
    )
}
const mapStateToProps = (state) => {
	return { web3:state.web3};
}

const mapDispatchToProps = (dispatch) => ({
	increment: (int) => dispatch(testSetValue('TEST_SET', { value1: int })),
	decrement: (int) => dispatch(testGetValue('TEST_GET', { value2: int }))
})

export default connect(mapStateToProps, mapDispatchToProps)(Test2)