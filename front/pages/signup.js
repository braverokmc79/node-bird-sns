import Head from 'next/head';
import React, { useCallback, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { Form, Input, Checkbox, Button } from 'antd';
import useInput from '../hooks/useInput';
import styled from 'styled-components';

const ErroMessage = styled.div`
    color:red;
`;

const SignUp = () => {

    const [id, onChangeId] = useInput('');
    const [nickName, onChangeNickname] = useInput('');
    const [password, onChangePassword] = useInput('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [term, setTerm] = useState("");
    const [termError, setTermError] = useState(false);


    const conChangePasswordCheck = useCallback((e) => {
        setPasswordCheck(e.target.value);
        setPasswordError(e.target.value !== password);
    }, [password]);


    const onChangeTerm = useCallback((e) => {
        setTerm(e.target.checked);
        setTermError(!e.target.checked);
    }, [])


    const onSubmit = useCallback(() => {
        if (password !== passwordCheck) {
            return setPasswordError(true);
        }
        if (!term) {
            return setTermError(true);
        }
    }, [password, passwordCheck, term]);


    return (
        <>
            <AppLayout>
                <Head>
                    <title>회원 가입 | NodeBird</title>
                </Head>


                <Form onFinish={onSubmit}>
                    <div>
                        <lable htmlFor="user-id">아이디</lable>
                        <br />
                        <Input name="user-id" value={id} require onChange={onChangeId} />
                    </div>


                    <div>
                        <lable htmlFor="user-nickName">닉네임</lable>
                        <br />
                        <Input name="user-nickName" value={nickName} require onChange={onChangeNickname} />
                    </div>


                    <div>
                        <lable htmlFor="user-password">비밀번호</lable>
                        <br />
                        <Input name="user-password" type="password" value={password} require onChange={onChangePassword} />
                    </div>

                    <div>
                        <br />
                        <lable htmlFor="user-passwordCheck">비밀번호</lable>
                        <Input name="user-passwordCheck" type="password" value={passwordCheck} require onChange={conChangePasswordCheck} />
                    </div>

                    {passwordError && <ErroMessage>비밀번호가 일치하지 않습니다.</ErroMessage>}

                    <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
                        동의합니다.
                    </Checkbox>
                    {termError && <div style={{ color: 'red' }}>약관에 동의하셔야 합니다.</div>}

                    <div style={{ marginTop: 10 }}>
                        <Button type="primary" htmlType='submit'>가입하기</Button>
                    </div>

                </Form>
            </AppLayout>
        </>
    );
};


export default SignUp;