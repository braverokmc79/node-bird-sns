
import React, { useEffect, useCallback } from 'react';
import AppLayout from './../components/AppLayout';
import { useSelector } from 'react-redux';
import PostCard from './../components/PostCard';
import PostForm from './../components/PostForm';

const Index = () => {
    const { me } = useSelector((state) => state.user);
    const { mainPosts } = useSelector((state) => state.post);



    return (
        <AppLayout>
            {me && <PostForm />}
            {mainPosts && mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
        </AppLayout>
    );
};

export default Index;