import { all, fork, put, takeLatest, delay } from 'redux-saga/effects';
import axios from 'axios';
import {
    LOG_IN_REQUEST, LOG_IN_SUCCESS, LOG_IN_FAILURE,
    LOG_OUT_REQUEST, LOG_OUT_SUCCESS, LOG_OUT_FAILURE,
    SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE,
} from '../reducers/user';


//1-1.로그인 처리
function logInAPI(data) {
    return axios.post('/api/login', data);
}


// const l = login({ type: "LOG_IN_REQUEST", data: { id: 'test@gmail.com' } });
// l.next();
// l.next();

//1-2.로그인 처리
function* login(action) {
    //put 을 dispatch
    //call 은 동기 함수 호출
    //fork 는 비동기 함수 호출
    try {
        console.log("2. 미들웨어로 사가 로그인 호출  : ", action);
        //const result = yield call(logInAPI, action.data);
        yield delay(1000);
        yield put({
            type: LOG_IN_SUCCESS,
            data: action.data
        });
        console.log("5. 미들웨어로 사가 로그인 호출  : ", action);
    } catch (err) {
        yield put({
            type: LOG_IN_FAILURE,
            error: err.response.data
        });
    }
}

//1-3 로그인 처리
function* watchLogIn() {
    //LOG_IN 실행 될때 까지 기다리겠다.
    console.log("2. watchLogIn ");
    yield takeLatest(LOG_IN_REQUEST, login);
}







//2-1.로그아웃 처리
function logOutAPI() {
    return axios.post('/api/logout');
}

//2-2.로그아웃 처리
function* logOut() {
    //put 을 dispatch
    //call 은 동기 함수 호출
    //fork 는 비동기 함수 호출
    try {
        //const result = yield call(logOutAPI);
        yield delay(1000);
        yield put({
            type: LOG_OUT_SUCCESS,
            // data: result.data
        });
    } catch (err) {
        yield put({
            type: LOG_OUT_FAILURE,
            error: err.response.data
        });
    }
}

//2-3 로그아웃 처리
function* watchLogOut() {
    while (true) {
        yield takeLatest(LOG_OUT_REQUEST, logOut);
    }
}









//3. 회원가입
function signUpAPI() {
    return axios.post('/api/signup');
}

function* signUp() {
    try {
        //const result = yield call(signUpAPI);
        yield delay(1000);
        //throw new Error('');
        yield put({
            type: SIGN_UP_SUCCESS,
            // data: result.data
        });
    } catch (err) {
        yield put({
            type: SIGN_UP_FAILURE,
            error: err.response.data
        });
    }
}

function* watchSignUp() {
    while (true) {
        yield takeLatest(SIGN_UP_REQUEST, signUp);
    }
}






//all 하면 한방에 배열로 적은 함수들이 실행처리 된다.
//fork , call 로 실행한다. all 은 fork 나 call 을 동시에 실행시키도록 한다.
//call 은 동기 함수 호출
//fork 는 비동기 함수 호출
export default function* userSaga() {
    yield all([
        fork(watchLogIn),
        fork(watchLogOut)
    ])
}

