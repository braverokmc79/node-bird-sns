import React from 'react';
import PropTypes from 'prop-types';

const ImagesZoom = ({ images, onClose }) => {
    return (
        <div>

        </div>
    );
};


ImagesZoom.propTypes = {
    images: PropTypes.arrayOf(PropTypes.object).isRequired,
    onClose: PropTypes.func.isRequired,
}

