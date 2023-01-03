//post/[id].js
import { useSelector } from 'react-redux';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';
import { LOAD_POST_REQUEST } from './../../reducers/post';
import { LOAD_MY_INFO_REQUEST } from './../../reducers/user';
import { END } from 'redux-saga';
import wrapper from '../../store/configureStore';
import axios from 'axios';

const Post = () => {
    const router = useRouter();
    const { id } = router.query;
    const { singlePost } = useSelector((state) => state.post)


    return (
        <AppLayout>
            {singlePost &&
                <Head>
                    <title>
                        {singlePost.User.nickname}
                        님의 글
                    </title>
                    <meta name="description" content={singlePost.content} />
                    <meta property="og:title" content={`${singlePost.User.nickname}님의 게시글`} />
                    <meta property="og:description" content={singlePost.content} />
                    <meta property="og:image" content={singlePost.Images[0] ? singlePost.Images[0].src : 'https://nodebird.com/favicon.ico'} />
                    <meta property="og:url" content={`https://nodebird.com/post/${id}`} />
                </Head>
            }

            {singlePost && <PostCard key={id && id} post={singlePost} />}
        </AppLayout>
    );
};


//새로 고침시 유지
export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, res, ...etc }) => {

    const cookie = req ? req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if (req && cookie) {
        axios.defaults.headers.Cookie = cookie;
    }

    store.dispatch({
        type: LOAD_MY_INFO_REQUEST,
    });

    store.dispatch({
        type: LOAD_POST_REQUEST,
        postId: req.url.replace('/post/', '')
    });

    store.dispatch(END);
    await store.sagaTask.toPromise();
})

export default Post;
