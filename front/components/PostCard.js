import React, { useState, useCallback } from 'react';
import { Card, Button, Avatar, Image, Popover, List } from 'antd';
import { Comment } from '@ant-design/compatible';

import { RetweetOutlined, HeartOutlined, MessageOutlined, EllipsisOutlined, HeartTwoTone } from '@ant-design/icons';
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux';
import PostImages from './PostImages';
import CommentForm from './CommentForm';
//import Comment from './Comment';


const PostCard = ({ post }) => {
    const id = useSelector((state) => state.user.me?.id);
    const [liked, setLiked] = useState(false);
    const [commentFormOpened, setCommentFormOpened] = useState(false);
    const onToggleLike = useCallback(() => {
        setLiked((prev) => !prev);
    }, []);

    const onToggleComment = useCallback(() => {
        setCommentFormOpened((prev) => !prev);
    }, [])

    const content = (
        <div>
            {id && post.User.id === id ? (
                <>
                    <Button>수정</Button>
                    <Button type='danger'>삭제</Button>
                </>
            ) : (
                <Button>신고</Button>
            )
            }
        </div >
    );
    return (
        <div style={{ marginBottom: 30 }}>
            <Card
                cover={post.Images[0] && <PostImages images={post.Images} />}
                actions={[
                    <RetweetOutlined key="retweet" />,
                    liked ? <HeartTwoTone key="heart" twoToneColor="#ebef96" onClick={onToggleLike} /> :
                        <HeartOutlined key="heart" onClick={onToggleLike} />,
                    <MessageOutlined key="comment" onClick={onToggleComment} />,
                    <Popover content={content} title="더보기" key="popover" style={{ textAlign: "center" }}>
                        <EllipsisOutlined />
                    </Popover>
                ]}
            >

                <Card.Meta
                    avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
                    title={post.User.nickname}
                    description={post.content}
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