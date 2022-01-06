import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { ModalOverlay } from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

const Modal = ({ onClose, children }) => {
  useEffect(() => {
    const onEscClick = e => {
      if (e.code === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onEscClick);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onEscClick);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const onOverlayClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <ModalOverlay onClick={onOverlayClick}>{children}</ModalOverlay>,
    modalRoot,
  );
};

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Modal;
