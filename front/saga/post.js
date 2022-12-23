import { all, fork, put, throttle, delay, takeLatest } from 'redux-saga/effects';
import shortId from 'shortid';
import axios from 'axios';
import {
    ADD_POST_REQUEST, ADD_POST_SUCCESS, ADD_POST_FAILURE,
    ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE,
    REMOVE_POST_REQUEST, REMOVE_POST_SUCCESS, REMOVE_POST_FAILURE
} from '../reducers/post'
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';



//3-1.
function addPostAPI(data) {
    return axios.post('/api/post', data);
}

//3-2.
function* addPost(action) {
    try {
        //const result = yield call(addPostAPI, action.data);
        yield delay(1000);


        const id = shortId.generate();
        yield put({
            type: ADD_POST_SUCCESS,
            data: {
                id,
                content: action.data
            }
        });
        console.log("1.게시글 등록  : ", id);

        yield put({
            type: ADD_POST_TO_ME,
            data: id
        })

        console.log("2. 게시글 등록  : ", id);

    } catch (err) {
        yield put({
            type: ADD_POST_FAILURE,
            error: err.response.data
        });
    }
}

//3-3
function* watchAddPost() {
    //yield throttle('ADD_POST_REQUEST', addPost, 3000);
    yield takeLatest(ADD_POST_REQUEST, addPost);
}




//게시글 삭제
function removePostAPI(data) {
    return axios.post('/api/removepost', data);
}
function* removePost(action) {
    try {
        yield delay(1000);

        yield put({
            type: REMOVE_POST_SUCCESS,
            data: action.data
        });

        yield put({
            type: REMOVE_POST_OF_ME,
            data: action.data
        })

    } catch (err) {
        yield put({
            type: REMOVE_POST_FAILURE,
            error: err.response.data
        });
    }
}

function* watchRemovePost() {
    yield takeLatest(REMOVE_POST_REQUEST, removePost);
}








//댓글
function addCommentAPI(data) {
    return axios.Comment('/api/comment', data);
}

function* addComment(action) {
    try {
        //const result =yield call(addCommentAPI, action.data);
        yield delay(1000);
        yield put({
            type: ADD_COMMENT_SUCCESS,
            data: action.data
        });
    } catch (err) {
        yield put({
            type: ADD_COMMENT_FAILURE,
            error: err.response.data
        });
    }
}

function* watchAddComment() {
    yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}









export default function* postSaga() {
    yield all([
        fork(watchAddPost),
        fork(watchAddComment),
        fork(watchRemovePost)
    ]);
}