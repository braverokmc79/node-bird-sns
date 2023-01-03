import React, { useEffect, useCallback } from 'react';
import AppLayout from './../components/AppLayout';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import FollowList from './../components/FollowList';
import NicknameEditForm from './../components/NicknameEditForm';
import { LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST, LOAD_MY_INFO_REQUEST } from '../reducers/user';
import { END } from 'redux-saga';
import wrapper from '../store/configureStore';
import axios from 'axios';


const Profile = () => {
    const { me } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: LOAD_FOLLOWERS_REQUEST
        });

        dispatch({
            type: LOAD_FOLLOWINGS_REQUEST
        });

    }, [LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST])

    useEffect(() => {
        if (!(me && me.id)) {
            Router.replace('/');
        }
    }, [me && me.id])
    if (!me) {
        return null;
    }

    return (
        <>
            <Head>
                <title>프로필 | NodeBird</title>
            </Head>
            <AppLayout>
                <NicknameEditForm />
                <div style={{ marginBottom: 20 }}></div>

                <FollowList header="팔로잉" data={me.Followings} />
                <FollowList header="팔로워" data={me.Followers} />
            </AppLayout>
        </>
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

    store.dispatch(END);
    await store.sagaTask.toPromise();
})

export default Profile;