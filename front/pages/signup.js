import Head from 'next/head';
import React from 'react';
import AppLayout from '../components/AppLayout';

const SignUp = () => {
    return (
        <>
            <Head>
                <title>회원 가입 | NodeBird</title>
            </Head>

            <AppLayout>
                회원가입 페이지
            </AppLayout>
        </>
    );
};

export default SignUp;