import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';





const PostImages = ({ images }) => {
    const [showImageZoom, setShowImagesZoom] = useState(false);

    const onZoom = useCallback(() => {
        setShowImagesZoom(true);
    }, []);


    const onClose = useCallback(() => {
        setShowImagesZoom(false);
    });



    if (images.length === 1) {
        return (
            <>
                <img role="presentation" src={images[0].src} alt={images[0].src} onClick={onZoom} width="50%" />
                {showImageZoom && <ImagesZoom image={images} onClose={onClose} />}
            </>
        )
    } else if (images.length === 2) {
        return (
            <>
                <div>
                    <img role="presentation" src={images[0].src} alt={images[0].src} onClick={onZoom} style={{ width: "50%" }} />
                    <img role="presentation" src={images[1].src} alt={images[1].src} onClick={onZoom} style={{ width: "50%" }} />
                    {showImageZoom && <ImagesZoom image={images} onClose={onClose} />}
                </div>
            </>
        )

    } else if (images.length > 2) {

        return (
            <>
                <div>
                    <img role="presentation" src={images[0].src} alt={images[0].src}
                        onClick={onZoom} style={{ width: "50%" }} />

                    <div
                        role="presentation"
                        style={{ display: 'inline-block', width: '50%', textAlign: 'center', verticalAlign: 'middle' }}
                        onClick={onZoom}
                    >
                        <PlusOutlined />
                        <br />
                        {images.length - 1}
                        개의 사진 더보기
                        {showImageZoom && <ImagesZoom image={images} onClose={onClose} />}
                    </div>
                </div>
            </>
        );
    }

};



PostImages.propTypes = {
    image: PropTypes.object.isRequired
}


export default PostImages;