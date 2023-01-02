
import React, { useEffect, useCallback } from 'react';
import AppLayout from './../components/AppLayout';
import { useSelector, useDispatch } from 'react-redux';
import PostCard from './../components/PostCard';
import PostForm from './../components/PostForm';
import { LOAD_MY_INFO_REQUEST } from './../reducers/user';
import { LOAD_POSTS_REQUEST } from './../reducers/post';

const Index = () => {
    const dispatch = useDispatch();
    const { me } = useSelector((state) => state.user);
    const { mainPosts, hasMorePosts, loadPostsLoading, reTweetError, reTweetDone } = useSelector((state) => state.post);

    useEffect(() => {
        dispatch({
            type: LOAD_MY_INFO_REQUEST
        });

        const lastId = mainPosts[mainPosts.length - 1]?.id;
        dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId
        });
    }, []);

    useEffect(() => {
        if (reTweetError) {
            return alert(reTweetError);
        }
    }, [reTweetError]);


    useEffect(() => {
        if (reTweetDone) {
            alert("리트윗 되었습니다.");
        }
    }, [reTweetDone]);



    useEffect(() => {
        function onScroll() {
            if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
                // console.log("hasMorePosts && !loadPostsLoading : ", hasMorePosts, loadPostsLoading);

                if (hasMorePosts && !loadPostsLoading) {
                    const lastId = mainPosts[mainPosts.length - 1]?.id;
                    // console.log(" lastId  : ", lastId);
                    dispatch({
                        type: LOAD_POSTS_REQUEST,
                        lastId
                    })
                }
            }
        }

        window.addEventListener('scroll', onScroll);
        //항상 반환처리시 이벤트를 제거해야지 메모리상에 낭비를 줄일 수 있다.
        return () => {
            window.removeEventListener('scroll', onScroll);
        }
    }, [hasMorePosts, loadPostsLoading, mainPosts]);




    return (
        <AppLayout>
            {me && <PostForm />}
            {mainPosts && mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
        </AppLayout>
    );
};

export default Index;