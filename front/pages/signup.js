import Head from 'next/head';
import React, { useCallback, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { Form, Input, Checkbox, Button } from 'antd';
import useInput from '../hooks/useInput';
import styled from 'styled-components';
import { SIGN_UP_REQUEST } from './../reducers/user';
import { useDispatch, useSelector } from 'react-redux';

const ErroMessage = styled.div`
    color:red;
`;

const SignUp = () => {
    const dispatch = useDispatch();
    const { signUpLoading } = useSelector((state) => state.user);

    const [email, onChangeEmail] = useInput('');
    const [nickname, onChangeNickname] = useInput('');
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
        console.log(email, nickname, password);

        dispatch({
            type: SIGN_UP_REQUEST,
            data: { email, password, nickname }
        })
    }, [email, password, passwordCheck, term]);


    return (
        <>
            <AppLayout>
                <Head>
                    <title>회원 가입 | NodeBird</title>
                </Head>


                <Form onFinish={onSubmit}>
                    <div>
                        <label htmlFor="user-email">이메일</label>
                        <br />
                        <Input name="user-email" type='email' value={email} require="true" onChange={onChangeEmail} />
                    </div>


                    <div>
                        <label htmlFor="user-nickname">닉네임</label>
                        <br />
                        <Input name="user-nickname" value={nickname} require="true" onChange={onChangeNickname} />
                    </div>


                    <div>
                        <label htmlFor="user-password">비밀번호</label>
                        <br />
                        <Input name="user-password" type="password" value={password} require="true" onChange={onChangePassword} />
                    </div>

                    <div>
                        <br />
                        <label htmlFor="user-passwordCheck">비밀번호</label>
                        <Input name="user-passwordCheck" type="password" value={passwordCheck} require="true" onChange={conChangePasswordCheck} />
                    </div>

                    {passwordError && <ErroMessage>비밀번호가 일치하지 않습니다.</ErroMessage>}

                    <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
                        동의합니다.
                    </Checkbox>
                    {termError && <div style={{ color: 'red' }}>약관에 동의하셔야 합니다.</div>}

                    <div style={{ marginTop: 10 }}>
                        <Button type="primary" htmlType='submit' loading={signUpLoading}>가입하기</Button>
                    </div>

                </Form>
            </AppLayout>
        </>
    );
};


export default SignUp;