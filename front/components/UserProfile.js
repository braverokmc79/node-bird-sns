import React, { useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequestAction } from './../reducers/user';

const UserProfile = () => {

    const dispatch = useDispatch();
    const { me, isLogginOut } = useSelector((state) => state.user);

    const onLogOut = useCallback(() => {
        dispatch(logoutRequestAction(false));
    }, []);


    return (
        <Card
            actions={[
                <div key="twit">짹짹<br />0</div>,
                <div key="followings">팔로잉<br />0</div>,
                <div key="follower">팔로워<br />0</div>,
            ]}
        >

            <Card.Meta
                avatar={<Avatar>{me.nickname}</Avatar>}
                title={me.nickname}
            />
            <Button className="mt-20" onClick={onLogOut} loading={isLogginOut}>로그아웃</Button>
        </Card>
    );
};

export default UserProfile;