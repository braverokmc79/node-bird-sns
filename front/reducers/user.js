export const initialState = {
    isLoggedIn: false,
    me: null,
    signUpdata: {},
    loginData: {}
}

export const loginAction = (data) => {
    return (dispatch, action) => {

        dispatch(loginRequestAction());
        axios.post('/api/login')
            .then((res) => {
                dispatch(loginSuccessAction(res.data));
            })
            .catch((err) => {
                dispatch(loginFailureAction(err));
            })
    }

    // return {
    //     type: "LOG_IN",
    //     data
    // }


}

export const loginRequestAction = (data) => {
    return {
        type: "LOG_IN_REQUEST",
        data
    }
}

export const loginSuccessAction = (data) => {
    return {
        type: "LOG_IN_SUCCESS",
        data
    }
}

export const loginFailureAction = (data) => {
    return {
        type: "LOG_IN_FAILURE",
        data
    }
}





export const logoutAction = () => {
    return {
        type: "LOG_OUT"
    }
}

export const logoutRequestAction = () => {
    return {
        type: "LOG_OUT_REQUEST"
    }
}

export const logoutSuccessAction = () => {
    return {
        type: "LOG_OUT_SUCCESS"
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOG_IN':
            return {
                ...state,
                isLoggedIn: true,
                me: action.data
            }
        case 'LOG_OUT':
            return {
                ...state,
                isLoggedIn: false,
                me: null
            }
        default:
            return state;
    }
}


export default reducer;


