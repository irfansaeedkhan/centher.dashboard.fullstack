export const testActionType = {
    TEST_GET:'TEST_GET',
    TEST_SET:'TEST_SET'
}

export const testSetValue = (data) => (dispatch) => {
    return dispatch({ type: testActionType.TEST_SET, value1:data.value1})
}

export const testGetValue = () => (dispatch) => {
    return dispatch({ type: testActionType.TEST_GET})
}