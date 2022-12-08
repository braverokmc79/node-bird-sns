import { Button, Form, Input } from 'antd';
import React, { useCallback } from 'react';
import useInput from '../hooks/useInput';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const CommentForm = ({ post }) => {
    const id = useSelector((state) => state.user.me?.id);

    const [commentText, onChangeCommentText] = useInput('');

    const onSubmitComment = useCallback(() => {
        console.log(post.id, commentText);
        console.log(" 아이디  : ", id);
    }, [commentText]);

    return (
        <Form onFinish={onSubmitComment}>
            <Input.TextArea value={commentText} onChange={onChangeCommentText} rows={4} />
            <Button type="primary" htmlType='submit' style={{ marginTop: 10 }}>삐악</Button>
        </Form>
    );
};

CommentForm.propType = {
    post: PropTypes.object.isRequired
}

export default CommentForm;