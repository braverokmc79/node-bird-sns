import { all, fork, put, throttle, delay, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';
import {
    ADD_POST_REQUEST, ADD_POST_SUCCESS, ADD_POST_FAILURE,
    ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE,
    REMOVE_POST_REQUEST, REMOVE_POST_SUCCESS, REMOVE_POST_FAILURE,
    LOAD_POSTS_REQUEST, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAILURE,
    LIKE_POST_REQUEST, LIKE_POST_SUCCESS, LIKE_POST_FAILURE,
    UNLIKE_POST_REQUEST, UNLIKE_POST_SUCCESS, UNLIKE_POST_FAILURE,
    UPLOAD_IMAGES_REQUEST, UPLOAD_IMAGES_SUCCESS, UPLOAD_IMAGES_FAILURE, generateDummyPost,
    RETWEET_REQUEST, RETWEET_SUCCESS, RETWEET_FAILURE
} from '../reducers/post'

import {
    ADD_POST_TO_ME, REMOVE_POST_OF_ME
} from '../reducers/user';




//리트윗
function retweetAPI(data) {
    return axios.post(`/post/${data}/retweet`, data);
}
function* retweet(action) {
    try {
        const result = yield call(retweetAPI, action.data);
        yield put({
            type: RETWEET_SUCCESS,
            data: result.data
        });
    } catch (err) {
        console.log(err);
        yield put({
            type: RETWEET_FAILURE,
            error: err.response.data
        });
    }
}
function* watchRetweet() {
    yield takeLatest(RETWEET_REQUEST, retweet);
}




//이미지 업로드
function uploadImagesAPI(data) {
    //form data  를 json  형식으로 감싸면 안된다.  {name:data}
    return axios.post(`/post/images`, data);
}

function* uploadImages(action) {
    try {
        const result = yield call(uploadImagesAPI, action.data);
        yield put({
            type: UPLOAD_IMAGES_SUCCESS,
            data: result.data
        });
    } catch (err) {
        console.log(err);
        yield put({
            type: UPLOAD_IMAGES_FAILURE,
            error: err.response.data
        });
    }
}
function* watchUploadImages() {
    yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}




//Like
function likePostAPI(data) {
    return axios.patch(`/post/${data}/like`);
}

function* likePost(action) {
    try {
        const result = yield call(likePostAPI, action.data);
        yield put({
            type: LIKE_POST_SUCCESS,
            data: result.data
        });
    } catch (err) {
        console.log(err);
        yield put({
            type: LIKE_POST_FAILURE,
            error: err.response.data
        });
    }
}
function* watchLikePost() {
    yield takeLatest(LIKE_POST_REQUEST, likePost);
}


//UN Like
function unlikePostAPI(data) {
    return axios.delete(`/post/${data}/like`);
}
function* unlikePost(action) {
    try {
        const result = yield call(unlikePostAPI, action.data);
        yield put({
            type: UNLIKE_POST_SUCCESS,
            data: result.data
        });
    } catch (err) {
        console.log(err);
        yield put({
            type: UNLIKE_POST_FAILURE,
            error: err.response.data
        });
    }
}
function* watchUnlikePost() {
    yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}




//무한 스크롤
function loadPostsAPI(lastId) {
    return axios.get(`/posts?lastId=${lastId || 0}&limit=10&offset=10`);
}

function* loadPosts(action) {
    try {

        // console.log("리액트 마지막 아이디 : ", action.lastId);
        const result = yield call(loadPostsAPI, action.lastId);
        // console.log(" 3무한 스크롤  generateDummyPost: ", generateDummyPost(10));



        yield put({
            type: LOAD_POSTS_SUCCESS,
            data: result.data
        });

        // yield put({
        //     type: LOAD_POSTS_SUCCESS,
        //     data: generateDummyPost(10)
        // });

        // if (result !== null) {
        //     yield put({
        //         type: LOAD_POSTS_SUCCESS,
        //         data: result.data
        //     });
        // } else {
        //     yield put({
        //         type: LOAD_POSTS_SUCCESS,
        //         data: generateDummyPost(10)
        //     });
        // }


    } catch (err) {
        console.log(err);
        yield put({
            type: LOAD_POSTS_FAILURE,
            error: err.response.data
        });
    }
}

function* watchLoadPosts() {
    // yield takeLatest(LOAD_POSTS_REQUEST, loadPosts);
    yield throttle(3000, LOAD_POSTS_REQUEST, loadPosts);
}






//3-1. 글작성
function addPostAPI(data) {
    //fomData 는 json 형태가 아닌 data 그자체 전송처리
    return axios.post('/post', data);
}

//3-2.
function* addPost(action) {
    try {
        const result = yield call(addPostAPI, action.data);
        console.log("2. 게시글 등록 후 반환 : ", result.data);
        yield put({
            type: ADD_POST_SUCCESS,
            data: result.data
        });

        yield put({
            type: ADD_POST_TO_ME,
            data: result.data.id
        });


    } catch (err) {
        console.log(err);
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
    return axios.delete(`/post/${data}`, data);
}

function* removePost(action) {
    try {

        const result = yield call(removePostAPI, action.data);
        console.log("게시글 삭제 :", action.data, result.data);

        yield put({
            type: REMOVE_POST_SUCCESS,
            data: result.data.PostId
        });

        yield put({
            type: REMOVE_POST_OF_ME,
            data: result.data.PostId
        });



    } catch (err) {
        console.log(err);
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
    return axios.post(`/post/${data.postId}/comment`, data); //POST post/1/comment
}

function* addComment(action) {
    try {
        const result = yield call(addCommentAPI, action.data);
        console.log(" 댓글 작성 완료  : ", result.data);

        yield put({
            type: ADD_COMMENT_SUCCESS,
            data: result.data
        });

    } catch (err) {
        console.log(err);
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
        fork(watchUploadImages),
        fork(watchAddPost),
        fork(watchAddComment),
        fork(watchRemovePost),
        fork(watchLoadPosts),
        fork(watchLikePost),
        fork(watchUnlikePost),
        fork(watchRetweet)
    ]);
}

