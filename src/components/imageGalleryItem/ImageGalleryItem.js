import PropTypes from 'prop-types';
import { useRef, useEffect } from 'react';

const ImageGalleryItem = ({
  url,
  largeImageURL,
  onOpen,
  getItemId,
  tags,
  id,
  isElToScroll,
  getElToScroll,
}) => {
  const elToScroll = useRef(null);

  useEffect(() => {
    if (!isElToScroll) return;
    getElToScroll(elToScroll.current);
  }, [getElToScroll, isElToScroll]);

  const onImageOpen = () => {
    getItemId({ largeImageURL, tags });
    onOpen();
  };
  return (
    <li className="ImageGalleryItem" ref={isElToScroll ? elToScroll : null}>
      <img
        className="ImageGalleryItem-image"
        src={url}
        alt={tags || 'wonderfull photo'}
        loading="lazy"
        onClick={onImageOpen}
        id={id}
      />
    </li>
  );
};

ImageGalleryItem.propTypes = {
  url: PropTypes.string.isRequired,
  onOpen: PropTypes.func.isRequired,
  getItemId: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  tags: PropTypes.string,
};

export default ImageGalleryItem;
