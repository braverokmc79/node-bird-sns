import { all, fork, call, take, put, takeEvery, takeLatest, takeLeading, throttle, delay } from 'redux-saga/effects';
import axios from 'axios';

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
        //const result = yield call(logInAPI, action.data);
        yield delay(1000);
        yield put({
            type: 'LOG_IN_SUCCESS',
            data: result.data
        });
    } catch (err) {
        yield put({
            type: "LOG_IN_FAILURE",
            data: err.response.data
        });
    }
}

//1-3 로그인 처리
function* watchLogIn() {
    //LOG_IN 실행 될때 까지 기다리겠다.
    yield takeLatest('LOG_IN_REQUEST', login);

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
            type: 'LOG_OUT_SUCCESS',
            // data: result.data
        });
    } catch (err) {
        yield put({
            type: "LOG_OUT_FAILURE",
            data: err.response.data
        });
    }
}

//2-3 로그아웃 처리
function* watchLogOut() {
    while (true) {
        yield takeEvery('LOG_OUT_REQUEST', logOut);
    }
}




//3-1.
function addPostAPI(data) {
    return axios.post('/api/post', data);
}

//3-2.
function* addPost(action) {
    try {
        //const result = yield call(addPostAPI, action.data);
        yield delay(1000);

        yield put({
            type: 'ADD_POST_SUCCESS',
            data: result.data
        });
    } catch (err) {
        yield put({
            type: "ADD_POST_FAILURE",
            data: err.response.data
        });
    }
}

//3-3
function* watchAddPost() {
    yield throttle('ADD_POST_REQUEST', addPost, 2000);
}



//all 하면 한방에 배열로 적은 함수들이 실행처리 된다.
//fork , call 로 실행한다. all 은 fork 나 call 을 동시에 실행시키도록 한다.
export default function* rootSaga() {
    yield all([
        fork(watchLogIn),
        fork(watchLogOut),
        fork(watchAddPost)
    ]);
}



