
import React, { useEffect, useCallback } from 'react';
import AppLayout from './../components/AppLayout';
import { useSelector, useDispatch } from 'react-redux';
import PostCard from './../components/PostCard';
import PostForm from './../components/PostForm';
import { LOAD_POSTS_REQUEST } from './../reducers/post';

const Index = () => {
    const dispatch = useDispatch();
    const { me } = useSelector((state) => state.user);
    const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);

    useEffect(() => {
        dispatch({
            type: LOAD_POSTS_REQUEST
        })
    }, []);


    useEffect(() => {
        function onScroll() {
            if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
                if (hasMorePosts && !loadPostsLoading) {
                    dispatch({
                        type: LOAD_POSTS_REQUEST
                    })
                }
            }
        }

        window.addEventListener('scroll', onScroll);
        //항상 반환처리시 이벤트를 제거해야지 메모리상에 낭비를 줄일 수 있다.
        return () => {
            window.removeEventListener('scroll', onScroll);
        }

    }, [hasMorePosts, loadPostsLoading]);



    return (
        <AppLayout>
            {me && <PostForm />}
            {mainPosts && mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
        </AppLayout>
    );
};

export default Index;