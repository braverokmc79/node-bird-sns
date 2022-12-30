import React, { useCallback, useEffect, useRef } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { addPost, UPLOAD_IMAGES_REQUEST } from '../reducers/post';
import useInput from '../hooks/useInput';


const PostForm = () => {
    const { imagePaths, addPostDone, addPostLoading, addPostError } = useSelector((state) => state.post);
    const dispatch = useDispatch();
    const imageInput = useRef();

    const [text, onChangeText, setText] = useInput('');

    useEffect(() => {
        if (addPostDone) {
            setText('');
        }
    }, [addPostDone])

    useEffect(() => {
        if (addPostError) {
            alert(addPostError);
        }
    }, [addPostError])

    const onSubmit = useCallback(() => {
        dispatch(addPost(text));
        setText("");
    }, [text]);


    const onClickImageUpload = useCallback(() => {
        imageInput.current.click();
    }, [imageInput.current]);


    const onChangeImages = useCallback((e) => {
        console.log('images', e.target.files);
        const imagesFormData = new FormData();

        //e.target.files 이   forEach   메서드가 없기 때문에  배열의    [].forEach.call를 빌려써서 사용한다.
        [].forEach.call(e.target.files, (f) => {
            imagesFormData.append('image', f);
        });

        dispatch({
            type: UPLOAD_IMAGES_REQUEST,
            data: imagesFormData
        });

    }, []);


    return (
        <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onFinish={onSubmit}>
            <Input.TextArea
                value={text}
                onChange={onChangeText}
                maxLength={140}
                placeholder="어떤 신기한 일이 있었나요?"
            />

            <div className='mt-5'>
                <input type="file" name="image" multiple hidden ref={imageInput} onChange={onChangeImages} style={{ display: "none" }} />
                <Button onClick={onClickImageUpload}>이미지 업로드</Button>


                <Button type="primary" htmlType='submit' style={{ float: 'right' }} loading={addPostLoading}   >글작성</Button>
            </div>
            <div>
                {
                    imagePaths.map((v) => (
                        <div key={v} style={{ display: "inline-block" }}>
                            <img src={v} style={{ width: '200px' }} alt={v} />
                            <div>
                                <Button>제거</Button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </Form>
    );
};

export default PostForm;