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
import FollowButton from './FollowButton';
import { LIKE_POST_REQUEST, UNLIKE_POST_REQUEST } from '../reducers/post';

const Global = createGlobalStyle`
    .ant-card-actions{
     background: #eeeeee !important;
    }
`;



const PostCard = ({ post }) => {
    const dispatch = useDispatch();
    const { removePostLoading } = useSelector((state) => state.post);
    const [commentFormOpened, setCommentFormOpened] = useState(false);
    const id = useSelector((state) => state.user.me?.id);
    const liked = post.Likers.find((v) => v.id === id);

    const onLike = useCallback(() => {
        dispatch({
            type: LIKE_POST_REQUEST,
            data: post.id
        })
    }, []);


    const onUnlike = useCallback(() => {
        dispatch({
            type: UNLIKE_POST_REQUEST,
            data: post.id
        })
    }, []);


    const onToggleComment = useCallback(() => {
        setCommentFormOpened((prev) => !prev);
    }, []);


    const onRemovePost = useCallback(() => {
        if (window.confirm("정말 삭제 하시겠습니까?")) {
            dispatch({
                type: REMOVE_POST_REQUEST,
                data: post.id
            })
        }

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
                    liked ? <HeartTwoTone key="heart" twoToneColor="red" onClick={onUnlike} /> :
                        <HeartOutlined key="heart" onClick={onLike} />,
                    <MessageOutlined key="comment" onClick={onToggleComment} />,
                    <Popover content={content} title="" key="popover" style={{ textAlign: "center" }}
                    >
                        <EllipsisOutlined />
                    </Popover>
                ]}
                extra={id && <FollowButton post={post} />}
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
        createdAt: PropTypes.string,
        Comment: PropTypes.arrayOf(PropTypes.object),
        Images: PropTypes.arrayOf(PropTypes.object),
        Likers: PropTypes.arrayOf(PropTypes.object)
    }).isRequired
}


export default PostCard;