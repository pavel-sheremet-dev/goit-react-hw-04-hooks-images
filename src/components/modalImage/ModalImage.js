import { Image } from './ModalImage.styled';

const ModalImage = ({ data }) => {
  const { largeImageURL, tags } = data;
  return <Image src={largeImageURL} alt={tags} />;
};

export default ModalImage;
