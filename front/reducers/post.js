import shortId from 'shortid';

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
                    id: shortId.generate(),
                    src: "https://cdn.pixabay.com/photo/2022/12/06/00/25/beach-7637946_960_720.jpg"
                },
                {
                    id: shortId.generate(),
                    src: "https://cdn.pixabay.com/photo/2022/11/22/10/37/house-7609267_960_720.jpg"
                },
            ],
            Comments: [{
                id: shortId.generate(),
                User: {
                    nickname: 'nero',
                },
                content: "우와 개정판이 나왔군요.~"
            },
            {
                id: shortId.generate(),
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
                    id: shortId.generate(),
                    src: "https://cdn.pixabay.com/photo/2014/08/01/00/08/pier-407252_960_720.jpg"
                },
                {
                    id: shortId.generate(),
                    src: "https://cdn.pixabay.com/photo/2015/01/28/23/35/hills-615429_960_720.jpg"
                },
                {
                    id: shortId.generate(),
                    src: "https://cdn.pixabay.com/photo/2014/11/27/10/29/mountain-547363_960_720.jpg"
                }
            ],
            Comments: [{
                id: shortId.generate(),
                User: {
                    nickname: 'nero',
                },
                content: "우와 개정판이 나왔군요.~"
            },
            {
                id: shortId.generate(),
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
                    id: shortId.generate(),
                    src: "https://cdn.pixabay.com/photo/2022/12/06/00/25/beach-7637946_960_720.jpg"
                },
            ],
            Comments: [{
                id: shortId.generate(),
                User: {
                    nickname: 'nero',
                },
                content: "우와 개정판이 나왔군요.~"
            },
            {
                id: shortId.generate(),
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
    id: shortId.generate(),
    content: data,
    User: {
        id: 1,
        nickname: '마카로닉스'
    }
});

const reducer = (state = initialState, action) => {
    switch (action.type) {

        //글작성
        case ADD_POST_REQUEST:
            return {
                ...state,
                addPostLoading: true,
                addPostDone: false,
                addPostError: null
            };

        case ADD_POST_SUCCESS:
            return {
                ...state,
                mainPosts: [dummyPost(action.data), ...state.mainPosts],
                addPostLoading: false,
                addPostDone: true
            }

        case ADD_POST_FAILURE:
            return {
                ...state,
                addPostLoading: false,
                addPostError: action.error
            }

        //글삭제
        case REMOVE_POST_REQUEST:
            return {
                ...state,
                removePostLoading: true,
                removePostDone: false,
                removePostError: null
            };

        case REMOVE_POST_SUCCESS:
            return {
                ...state,
                mainPosts: state.mainPosts.filter((v) => v.id !== action.data),
                removePostLoading: false,
                removePostDone: true
            }

        case REMOVE_POST_FAILURE:
            return {
                ...state,
                removePostLoading: false,
                removePostError: action.error
            }


        //댓글 작성
        case ADD_COMMENT_REQUEST:
            return {
                ...state,
                addCommentLoading: true,
                addCommentDone: false,
                addCommentError: null
            };

        case ADD_COMMENT_SUCCESS: {
            const postIndex = state.mainPosts.findIndex((v) => v.id === action.data.postId);
            const post = state.mainPosts[postIndex];
            post.Comments = [dummyComment(action.data.content), ...post.Comments];
            const mainPosts = [...state.mainPosts];
            mainPosts[postIndex] = post;

            return {
                ...state,
                mainPosts,
                addCommentLoading: false,
                addCommentDone: true
            }
        }

        case ADD_COMMENT_FAILURE:
            return {
                ...state,
                addCommentLoading: false,
                addCommentError: action.error
            }


        default:
            return state;
    }
}


export default reducer;


