const initialState = {
    mainPosts: [
        {
            id: 1,
            User: {
                id: 1,
                nickname: '마카로닉스'
            },
            content: '첫 번째 게시글 #해시태그 #익스프레스',
            Images: [
                { src: "https://cdn.pixabay.com/photo/2022/12/06/00/25/beach-7637946_960_720.jpg" },
                { src: "https://cdn.pixabay.com/photo/2022/11/22/10/37/house-7609267_960_720.jpg" },
            ],
            Comments: [{
                User: {
                    nickname: 'nero',
                },
                content: "우와 개정판이 나왔군요.~"
            },
            {
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
                { src: "https://cdn.pixabay.com/photo/2014/08/01/00/08/pier-407252_960_720.jpg" },
                { src: "https://cdn.pixabay.com/photo/2015/01/28/23/35/hills-615429_960_720.jpg" },
                { src: "https://cdn.pixabay.com/photo/2014/11/27/10/29/mountain-547363_960_720.jpg" }
            ],
            Comments: [{
                User: {
                    nickname: 'nero',
                },
                content: "우와 개정판이 나왔군요.~"
            },
            {
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
                { src: "https://cdn.pixabay.com/photo/2022/12/06/00/25/beach-7637946_960_720.jpg" },
            ],
            Comments: [{
                User: {
                    nickname: 'nero',
                },
                content: "우와 개정판이 나왔군요.~"
            },
            {
                User: {
                    nickname: 'hero',
                },
                content: "얼른 사고 싶어요"
            },
            ]
        },

    ],
    imagePaths: [],
    postAdded: false
}

const ADD_POST = 'ADD_POST';
export const addPost = {
    type: ADD_POST,
}

const dummyPost = {
    id: 2,
    content: '더미데이터',
    User: {
        id: 1,
        nickname: '마카로닉스'
    },
    Images: [],
    Comments: []

}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_POST:
            return {
                ...state,
                mainPosts: [dummyPost, ...state.mainPosts],
                postAdded: true
            }
        default:
            return state;
    }
}


export default reducer;


