import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const PostCardContent = ({ postData }) => {
    //첫번째 게시글 #해시태그 #익스프레스
    return (
        <div>

            {postData && postData.split(/(#[^\s#]+)/g).map((v, index) => {
                if (v.match(/(#[^\s#]+)/)) {
                    return <Link key={index} href={`/hashtag/${v.slice(1)}`} prefetch={false}    >{v}</Link>
                }
                return v;
            })}
        </div>
    );
};

PostCardContent.propTypes = {
    postData: PropTypes.string.isRequired
}


export default PostCardContent;