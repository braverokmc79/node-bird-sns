import React, { useEffect } from 'react';
import AppLayout from './../components/AppLayout';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import FollowList from './../components/FollowList';
import NicknameEditForm from './../components/NicknameEditForm';



const Profile = () => {
    const { me } = useSelector((state) => state.user);

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

export default Profile;