import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


import styled from 'styled-components';


const Overlay = styled.div`
    position:fixed;
    z-index:5000;
    top:0;
    left:0;
    right:0;
    bottom:0;
`;

const Header = styled.header`
    height:44px;
    background:white;
    position:relative;
    padding:0;
    text-align:center;

    & h1{
        margin:0;
        font-size:17px;
        color:#333;
        line-height:44px;
    }
    & button{
        position:absolute;
        right:0;
        top:0;
        padding:15px;
        line-height:10px;
        cursor:pointer;
        background: #faad14;
        color: #fff;
        border: 1px solid #fa8c16;
    }
`;

const SlickWrapper = styled.div`
    height:calc(100% -44px);
    background:rgba(0, 0, 0, 0.9);
    border:none !important;
`;

const ImageWrapper = styled.div`
    padding:32px;
    text-align:center;
    &img{
        margin:0 auto;
        max-height:750px;
        display: inline-block !important;
    }
`;


const ImagesZoom = ({ images, onClose }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        //autoplay: true,
        autoplayspeed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        pauseOnHover: true,

    };
    const [currentSlide, setCurrentSlide] = useState(0);

    return (
        <Overlay>
            <Header>
                <h1>상세 이미지 {images.length}</h1>
                <button onClick={onClose} >x</button>
            </Header>

            <SlickWrapper>
                <div>
                    <Slick
                        // settings={settings}
                        initialSlide={0}
                        afterChange={(slide) => setCurrentSlide(slide)}
                        infinite
                        arrows={false}
                        slidesToShow={1}
                        slidesToScroll={1}
                    >
                        {images && images.map((v) => {
                            return (
                                <ImageWrapper key={v.src}>
                                    <img src={v.src} alt={v.src} />
                                </ImageWrapper>
                            )
                        })}
                    </Slick>
                </div>
            </SlickWrapper>
        </Overlay>
    );
};


ImagesZoom.propTypes = {
    images: PropTypes.arrayOf(PropTypes.object).isRequired,
    onClose: PropTypes.func.isRequired,
}

export default ImagesZoom;
