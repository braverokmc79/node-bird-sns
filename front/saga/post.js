import { all, fork, put, throttle, delay, takeLatest, call } from 'redux-saga/effects';
import shortId from 'shortid';
import axios from 'axios';
import {
    ADD_POST_REQUEST, ADD_POST_SUCCESS, ADD_POST_FAILURE,
    ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE,
    REMOVE_POST_REQUEST, REMOVE_POST_SUCCESS, REMOVE_POST_FAILURE,
    LOAD_POSTS_REQUEST, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAILURE, generateDummyPost,

} from '../reducers/post'
import {
    ADD_POST_TO_ME, REMOVE_POST_OF_ME

} from '../reducers/user';






//무한 스크롤
function loadPostsAPI(data) {
    return axios.post('/api/posts', data);
}

function* loadPosts(action) {
    try {
        yield delay(1000);
        console.log(" 무한 스크롤 : ");

        yield put({
            type: LOAD_POSTS_SUCCESS,
            data: generateDummyPost(10)
        });

    } catch (err) {
        yield put({
            type: LOAD_POSTS_FAILURE,
            error: err.response.data
        });
    }
}

function* watchLoadPosts() {
    // yield takeLatest(LOAD_POSTS_REQUEST, loadPosts);
    yield throttle(5000, LOAD_POSTS_REQUEST, loadPosts);
}






//3-1. 글작성
function addPostAPI(data) {
    return axios.post('/post', { content: data });
}

//3-2.
function* addPost(action) {
    try {
        const result = yield call(addPostAPI, action.data);

        console.log("2. 게시글 등록 후 반환 : ", result);

        yield put({
            type: ADD_POST_SUCCESS,
            data: result.data
        });

        yield put({
            type: ADD_POST_TO_ME,
            data: result.data.id
        })



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
    return axios.Comment(`/post/${data.postId}/comment`, data); //POST post/1/comment
}

function* addComment(action) {
    try {
        const result = yield call(addCommentAPI, action.data);

        yield put({
            type: ADD_COMMENT_SUCCESS,
            data: result.data
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
        fork(watchRemovePost),
        fork(watchLoadPosts)

    ]);
}