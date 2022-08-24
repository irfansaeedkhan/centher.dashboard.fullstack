export const testActionType = {
    TEST_GET:'TEST_GET',
    TEST_SET:'TEST_SET'
}

export const testSetValue = (data) => {
    return { type: testActionType.TEST_SET, value1:data.value1}
}

export const testGetValue = () =>{
    return { type: testActionType.TEST_GET}
}