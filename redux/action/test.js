export const testActionType = {
    TEST_GET:'TEST_GET',
    TEST_SET:'TEST_SET'
}

export const testSetValue = (type, payload) => (dispatch)=> {
    dispatch({
		type,
		payload
	})
}

export const testGetValue = (type, payload) => (dispatch)=>{
    dispatch({
		type,
		payload
	})
}