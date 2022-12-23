import React, { useState, useCallback } from 'react';
import { Card, Button, Avatar, Image, Popover, List, Space } from 'antd';
import { Comment } from '@ant-design/compatible';
import { RetweetOutlined, HeartOutlined, MessageOutlined, EllipsisOutlined, HeartTwoTone } from '@ant-design/icons';
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux';
import PostImages from './PostImages';
import CommentForm from './CommentForm';
import { createGlobalStyle } from 'styled-components';
import PostCardContent from './PostCardContent';
import { REMOVE_POST_REQUEST } from '../reducers/post';

const Global = createGlobalStyle`
    .ant-card-actions{
     background: #eeeeee !important;
    }
`;



const PostCard = ({ post }) => {
    const dispatch = useDispatch();

    const id = useSelector((state) => state.user.me?.id);
    const { removePostLoading } = useSelector((state) => state.post);

    const [liked, setLiked] = useState(false);
    const [commentFormOpened, setCommentFormOpened] = useState(false);
    const onToggleLike = useCallback(() => {
        setLiked((prev) => !prev);
    }, []);

    const onToggleComment = useCallback(() => {
        setCommentFormOpened((prev) => !prev);
    }, []);


    const onRemovePost = useCallback(() => {
        dispatch({
            type: REMOVE_POST_REQUEST,
            data: post.id
        })
    }, []);


    const content = (
        <div>
            {id && post.User.id === id ? (
                <Space wrap>
                    <Button type='primary' info>수정</Button>
                    <Button type='primary' danger loading={removePostLoading} onClick={onRemovePost}>삭제</Button>
                </Space>

            ) : (
                <Button>신고</Button>
            )
            }
        </div >
    );
    return (
        <div style={{ marginBottom: 50 }}>
            <Global />

            <Card key={post.Image}
                cover={post.Images[0] && <PostImages images={post.Images} />}
                actions={[
                    <RetweetOutlined key="retweet" />,
                    liked ? <HeartTwoTone key="heart" twoToneColor="#ebef96" onClick={onToggleLike} /> :
                        <HeartOutlined key="heart" onClick={onToggleLike} />,
                    <MessageOutlined key="comment" onClick={onToggleComment} />,
                    <Popover content={content} title="" key="popover" style={{ textAlign: "center" }}>
                        <EllipsisOutlined />
                    </Popover>
                ]}
            >
                <Card.Meta
                    avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
                    title={post.User.nickname}
                    description={<PostCardContent postData={post.content} />}

                />
                <Image />

            </Card >



            {commentFormOpened && (
                <div>

                    <CommentForm post={post} />
                    <List
                        header={`${post.Comments.length} 개의 댓글`}
                        itemLayout="horizontal"
                        dataSource={post.Comments}
                        renderItem={(item) => (
                            <li>
                                <Comment
                                    author={item.User.nickname}
                                    avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
                                    content={item.content}
                                />
                            </li>
                        )}
                    />
                </div>
            )}

            {/* <CommentForm />
            <Comments /> */}

        </div >
    );
};

PostCard.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.number,
        User: PropTypes.object,
        content: PropTypes.string,
        createdAt: PropTypes.object,
        Comment: PropTypes.arrayOf(PropTypes.object),
        Images: PropTypes.arrayOf(PropTypes.object)
    }).isRequired
}


export default PostCard;