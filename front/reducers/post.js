import shortid from 'shortid';
import produce from 'immer';
import { faker } from '@faker-js/faker';

faker.seed(123);

export const initialState = {
    mainPosts: [
        {
            id: 1,
            User: {
                id: 1,
                nickname: '마카로닉스'
            },
            content: '첫 번째 게시글 #해시태그 #익스프레스',
            Images: [
                {
                    id: shortid.generate(),
                    src: "https://cdn.pixabay.com/photo/2022/12/06/00/25/beach-7637946_960_720.jpg",
                    onerror: "https://via.placeholder.com/600x400"
                },
                {
                    id: shortid.generate(),
                    src: "https://cdn.pixabay.com/photo/2022/11/22/10/37/house-7609267_960_720.jpg",
                    onerror: "https://via.placeholder.com/600x400"
                },
            ],
            Comments: [{
                id: shortid.generate(),
                User: {
                    nickname: 'nero',
                },
                content: "우와 개정판이 나왔군요.~"
            },
            {
                id: shortid.generate(),
                User: {
                    nickname: 'hero',
                },
                content: "얼른 사고 싶어요"
            },
            ]
        },

        {
            id: 2,
            User: {
                id: 1,
                nickname: '마카로닉스'
            },
            content: '첫 번째 게시글 #해시태그 #익스프레스',
            Images: [
                {
                    id: shortid.generate(),
                    src: "https://cdn.pixabay.com/photo/2014/08/01/00/08/pier-407252_960_720.jpg",
                    onerror: "https://via.placeholder.com/600x400"
                },
                {
                    id: shortid.generate(),
                    src: "https://cdn.pixabay.com/photo/2015/01/28/23/35/hills-615429_960_720.jpg",
                    onerror: "https://via.placeholder.com/600x400"
                },
                {
                    id: shortid.generate(),
                    src: "https://cdn.pixabay.com/photo/2014/11/27/10/29/mountain-547363_960_720.jpg",
                    onerror: "https://via.placeholder.com/600x400"
                }
            ],
            Comments: [{
                id: shortid.generate(),
                User: {
                    nickname: 'nero',
                },
                content: "우와 개정판이 나왔군요.~"
            },
            {
                id: shortid.generate(),
                User: {
                    nickname: 'hero',
                },
                content: "얼른 사고 싶어요"
            },
            ]
        },
        {
            id: 3,
            User: {
                id: 1,
                nickname: '마카로닉스'
            },
            content: '첫 번째 게시글 #해시태그 #익스프레스',
            Images: [
                {
                    id: shortid.generate(),
                    src: "https://cdn.pixabay.com/photo/2022/12/06/00/25/beach-7637946_960_720.jpg",
                    onerror: "https://via.placeholder.com/600x400"
                },
            ],
            Comments: [{
                id: shortid.generate(),
                User: {
                    nickname: 'nero',
                },
                content: "우와 개정판이 나왔군요.~"
            },
            {
                id: shortid.generate(),
                User: {
                    nickname: 'hero',
                },
                content: "얼른 사고 싶어요"
            },
            ]
        },

    ],

    imagePaths: [],
    addPostLoading: false,
    addPostDone: false,
    addPostError: null,

    removePostLoading: false,
    removePostDone: false,
    removePostError: null,

    addCommentLoading: false,
    addCommentDone: false,
    addCommentError: null
}

initialState.mainPosts = initialState.mainPosts.concat(
    Array(20).fill().map((v, i) => ({
        id: shortid.generate(),
        User: {
            id: shortid.generate(),
            nickname: faker.internet.userName()
        },
        content: faker.lorem.paragraph(),
        Images: [{
            id: shortid.generate(),
            src: 'https://picsum.photos/600/400?random=' + i,
            onerror: "https://via.placeholder.com/600x400"
        }],
        Comments: [{
            id: shortid.generate(),
            User: {
                nickname: faker.internet.userName()
            },
            content: faker.lorem.paragraph()
        }]
    }))
)



export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';


export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';


export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';


export const addPost = (data) => ({
    type: ADD_POST_REQUEST,
    data
});


export const addComment = (data) => ({
    type: ADD_COMMENT_REQUEST,
    data
});




const dummyPost = (data) => ({
    id: data.id,
    content: data.content,
    User: {
        id: 1,
        nickname: '마카로닉스'
    },
    Images: [],
    Comments: []
});

const dummyComment = (data) => ({
    id: shortid.generate(),
    content: data,
    User: {
        id: 1,
        nickname: '마카로닉스'
    }
});

//이전 상태를 액션을 통해 다음 상태로 만들어내는 함수(불변성은 지키면서)
const reducer = (state = initialState, action) => produce(state, (draft) => {

    switch (action.type) {

        //글작성
        case ADD_POST_REQUEST:
            draft.addPostLoading = true;
            draft.addPostDone = false;
            draft.addPostError = null;
            break;

        case ADD_POST_SUCCESS:
            draft.addPostLoading = false;
            draft.addPostDone = true;
            draft.mainPosts.unshift(dummyPost(action.data));
            break;

        case ADD_POST_FAILURE:
            draft.addPostLoading = false;
            draft.addPostError = action.error;
            break;



        //글삭제
        case REMOVE_POST_REQUEST:
            draft.removePostLoading = true;
            draft.removePostDone = false;
            draft.removePostError = null;
            break;

        case REMOVE_POST_SUCCESS:
            draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data);
            draft.removePostLoading = false;
            draft.removePostDone = true;
            break;

        case REMOVE_POST_FAILURE:
            draft.removePostLoading = false;
            draft.removePostError = action.error;
            break;



        //댓글 작성
        case ADD_COMMENT_REQUEST:
            draft.addCommentLoading = true;
            draft.addCommentDone = false;
            draft.addCommentError = null;
            break;


        case ADD_COMMENT_SUCCESS: {
            const post = draft.mainPosts.find((v) => v.id === action.data.postId);
            post.Comments.unshift(dummyComment(action.data.content));
            draft.addCommentLoading = false;
            draft.addCommentDone = true;
            break;

            // const postIndex = state.mainPosts.findIndex((v) => v.id === action.data.postId);
            // const post = state.mainPosts[postIndex];
            // post.Comments = [dummyComment(action.data.content), ...post.Comments];
            // const mainPosts = [...state.mainPosts];
            // mainPosts[postIndex] = post;

            // return {
            //     ...state,
            //     mainPosts,
            //     addCommentLoading: false,
            //     addCommentDone: true
            // }
        }

        case ADD_COMMENT_FAILURE:
            draft.addCommentLoading = false;
            draft.addCommentError = action.error;
            break;

        default:
            break;
    }
});




export default reducer;


