import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link'
import { Menu, Input, Row, Col } from 'antd';

const AppLayout = ({ children }) => {

    return (
        <div>
            <Menu mode="horizontal">
                <Menu.Item key="1">
                    <Link href="/">노드버드</Link>
                </Menu.Item>
                <Menu.Item key="2">
                    <Link href="/profile">프로필</Link>
                </Menu.Item>
                <Menu.Item key="3">
                    <Input.Search enterButton style={{ verticalAlign: 'middle' }} />
                </Menu.Item>
                <Menu.Item key="4">
                    <Link href="/signup">회원가입</Link>
                </Menu.Item>
            </Menu>
            <Row gutter={8}>
                <Col xs={24} md={6} >
                    왼쪽 메뉴
                </Col>
                <Col xs={24} md={6} >
                    {children}
                </Col>
                <Col xs={24} md={6} >
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