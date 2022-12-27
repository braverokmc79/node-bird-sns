import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link'
import { Menu, Input, Row, Col } from 'antd';

import styled from 'styled-components';
import { useSelector } from 'react-redux';


import UserProfile from './UserProfile';
import LoginForm from './LoginForm';

const SearchInput = styled(Input.Search)`
    vertical-align: 'middle' ;
`;



const AppLayout = ({ children }) => {

    const { me } = useSelector((state) => state.user);

    const onClick = useCallback((e) => {
        console.log('click ', e);
        //setCurrent(e.key);
    }, []);

    const items = [
        { label: <Link href="/">노드버드</Link>, key: 'item-1' },
        me && { label: <Link href="/profile">프로필</Link>, key: 'item-2' },
        {
            label: <SearchInput enterButton />,
            key: 'item-3'
        },
        !me && { label: <Link href="/signup">회원가입</Link>, key: 'item-4' },
    ];


    return (
        <div>
            <Menu onClick={onClick} mode="horizontal" items={items} />
            <Row gutter={24} style={{ marginTop: 20 }}>
                <Col xs={24} md={6} style={{ marginTop: 20 }}>
                    Hello.Next
                </Col>
            </Row>
            <Row gutter={24} style={{ marginTop: 20 }}>
                <Col xs={24} md={6} style={{ marginTop: 20 }}>
                    {me ? <UserProfile /> : <LoginForm />}
                </Col>
                <Col xs={24} md={16} style={{ marginTop: 20 }} >
                    {children}
                </Col>
            </Row>

            <Row gutter={24} style={{ marginTop: 20 }}>
                <Col xs={24} md={24} style={{ marginTop: 20 }}>
                    <a href='https://macaronics.net' target="_blank" rel="noreferrer noopener"  >
                        Made by macaronics
                    </a>
                </Col>
            </Row>

        </div>
    );

};

AppLayout.prototype = {
    children: PropTypes.node.isRequired
}

export default AppLayout;