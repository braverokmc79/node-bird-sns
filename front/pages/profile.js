import React from 'react';
import AppLayout from './../components/AppLayout';
import Head from 'next/head';
import FollowList from './../components/FollowList';
import NicknameEditForm from './../components/NicknameEditForm';

const Profile = () => {
    const followingList = [{ nickname: 'aaaa' }, { nickname: 'bbbb' }, { nickname: 'ccc' }];
    const followerList = [{ nickname: 'ddd' }, { nickname: 'eee' }, { nickname: 'fff' }];
    return (
        <>
            <Head>
                <title>프로필 | NodeBird</title>
            </Head>
            <AppLayout>
                <NicknameEditForm />
                <div style={{ marginBottom: 20 }}></div>

                <FollowList header="팔로잉 목록" data={followingList} />
                <FollowList header="팔로워 목록" data={followerList} />
            </AppLayout>
        </>
    );
};

export default Profile;