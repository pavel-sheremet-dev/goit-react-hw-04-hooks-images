import PropTypes from 'prop-types';
import ImageGalleryItem from '../imageGalleryItem/ImageGalleryItem';

const ImageGallery = ({
  items,
  onOpen,
  getItemId,
  idElToScroll,
  getElToScroll,
}) => {
  return (
    <ul className="ImageGallery">
      {items.map(({ id, webformatURL, tags, largeImageURL }) => (
        <ImageGalleryItem
          isElToScroll={id === idElToScroll}
          key={id}
          url={webformatURL}
          onOpen={onOpen}
          getItemId={getItemId}
          id={id}
          tags={tags}
          largeImageURL={largeImageURL}
          getElToScroll={getElToScroll}
        />
      ))}
    </ul>
  );
};

ImageGallery.propTypes = {
  items: PropTypes.array,
  onOpen: PropTypes.func,
  getItemId: PropTypes.func,
};

export default ImageGallery;
