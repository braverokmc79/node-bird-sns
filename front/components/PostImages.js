import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import ImagesZoom from "./ImagesZoom"



const PostImages = ({ images }) => {
    const [showImageZoom, setShowImagesZoom] = useState(false);

    const onZoom = useCallback(() => {
        setShowImagesZoom(true);
    }, []);


    const onClose = useCallback(() => {
        setShowImagesZoom(false);
    }, []);



    if (images.length === 1) {
        return (
            <>

                <img role="presentation" src={images[0].src} alt={images[0].src} onClick={onZoom} width="50%" />
                {showImageZoom && <ImagesZoom images={images} onClose={onClose} />}
            </>
        )
    } else if (images.length === 2) {
        return (
            <>
                <div>
                    <img role="presentation" src={images[0].src} alt={images[0].src} onClick={onZoom} style={{ width: "50%" }} />
                    <img role="presentation" src={images[1].src} alt={images[1].src} onClick={onZoom} style={{ width: "50%" }} />
                    {showImageZoom && <ImagesZoom images={images} onClose={onClose} />}
                </div>
            </>
        )

    } else if (images.length > 2) {

        return (
            <>
                <div style={{ width: "100%" }}>
                    <img role="presentation" src={images[0].src} alt={images[0].src}
                        onClick={onZoom} style={{ width: "50%", display: `${showImageZoom ? 'none' : "inline-block"}` }} />

                    <div
                        role="presentation"
                        style={{
                            display: 'inline-block', textAlign: 'center', width: "50%",
                            verticalAlign: 'middle', position: "relative", top: "-50px"
                        }}
                    >
                        <div onClick={onZoom} style={{ cursor: "pointer" }}>  <PlusOutlined /></div>

                        <br />
                        {images.length - 1}
                        개의 사진 더보기

                        {showImageZoom && <ImagesZoom images={images} onClose={onClose} />}
                    </div>
                </div>
            </>
        );
    }

};



PostImages.propTypes = {
    images: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default PostImages;