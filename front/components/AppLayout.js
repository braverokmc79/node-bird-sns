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

const items = [
    { label: <Link href="/">노드버드</Link>, key: 'item-1' },
    { label: <Link href="/profile">프로필</Link>, key: 'item-2' },
    {
        label: <SearchInput enterButton />,
        key: 'item-3'
    },
    { label: <Link href="/signup">회원가입</Link>, key: 'item-4' },
];

const AppLayout = ({ children }) => {

    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);



    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    // const [current, setCurrent] = useState('item-1');
    const onClick = useCallback((e) => {
        console.log('click ', e);
        //setCurrent(e.key);
    }, []);


    return (
        <div>
            <Menu onClick={onClick} mode="horizontal" items={items} />
            <Row gutter={8} className="mt-20">

                <Col xs={24} md={6} className="text-center mt-20">
                    Hello.Next
                </Col>

                <Col xs={24} md={6} className="mt-20">
                    {isLoggedIn ? <UserProfile /> : <LoginForm />}
                </Col>

                <Col xs={24} md={6} className="mt-20" >
                    {children}
                </Col>

                <Col xs={24} md={6} className="text-center mt-20">
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