import { useState, useEffect, useRef, useReducer } from 'react';
import { GlobalStyle } from './styles/GlobalStyles';
import './styles/App.css';
import toast, { Toaster } from 'react-hot-toast';
import { BsFillArrowUpCircleFill } from 'react-icons/bs';

import Modal from './components/modal/Modal';
import SearchBar from './components/searchBar/SearchBar';
import { Api } from './servises/apiServices';
import notFoundImgUrl from './images/broken.png';
import ImageGallery from './components/imageGallery/ImageGallery';
import Button from './components/button/Button';
import Loader from './components/loader/Loader';
import Error from './components/error/Error';
import ScrollToTop from 'react-scroll-to-top';
import ModalImage from './components/modalImage/ModalImage';

const api = new Api(notFoundImgUrl);

const galleryItemsReducer = (state = [], { type = 'set', payload = [] }) => {
  switch (type) {
    case 'set':
      return payload;
    case 'add':
      return [...state, ...payload];
    default:
      console.log('unknown type on galleryItemsReducer');
      break;
  }
};

const rTypes = {
  set: 'set',
  add: 'add',
};

const App = () => {
  const [page, setPage] = useState(api.firstPage);
  const [query, setQuery] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [galleryItems, dispatch] = useReducer(galleryItemsReducer, []);
  const [modalContent, setModalContent] = useState(null);

  const totalHits = useRef(null);
  const itemToScroll = useRef(null);
  const isLastPage = useRef(true);
  const isFirstLoading = useRef(true);

  // page or query change useEffect
  useEffect(() => {
    if (isFirstLoading.current) {
      isFirstLoading.current = false;
      return;
    }

    if (!query) return;

    const fetchGalleryItems = async () => {
      totalHits.current = null;
      setLoading(true);
      try {
        const data = await api.fetchPictures(query, page);

        if (!data.hits.length) {
          toast('not found photos');
          dispatch({ type: rTypes.set, payload: [] });
          isLastPage.current = true;
          return;
        }

        totalHits.current = data.totalHits;
        itemToScroll.current = data.hits[0].id;
        isLastPage.current = api.countTotalResults(page) > totalHits.current;

        const normalizeData = api.getNormalizeData(data, page);
        const reduserType = page === api.firstPage ? rTypes.set : rTypes.add;
        dispatch({ type: reduserType, payload: normalizeData });

        if (page !== api.firstPage) {
          document.getElementById(itemToScroll.current)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      } catch (error) {
        setError(error);
        toast.error('Somesing went whrong');
      } finally {
        setLoading(false);
      }
    };
    fetchGalleryItems();
  }, [page, query]);

  // for modal close
  useEffect(() => {
    if (showModal) return;
    setModalContent(null);
  }, [showModal]);

  const getQuery = query => {
    setQuery(query);
    setPage(api.firstPage);
  };

  const toggleModal = () => setShowModal(prev => !prev);

  const onLoadMoreClick = () => setPage(prev => prev + 1);

  return (
    <>
      <GlobalStyle />

      <div className="App">
        <SearchBar getQuery={getQuery} query={query} />

        {error && <Error errorMsg={error.message} />}

        {!!galleryItems.length && (
          <>
            <ImageGallery
              items={galleryItems}
              onOpen={toggleModal}
              getItemId={setModalContent}
            />
            <ScrollToTop
              smooth
              top="300"
              style={{
                backgroundColor: 'transparent',
                boxShadow: 'none',
              }}
              component={<BsFillArrowUpCircleFill size="2em" color="#cccccc" />}
            />
          </>
        )}

        {loading ? (
          <Loader />
        ) : (
          !isLastPage.current && <Button onClick={onLoadMoreClick} />
        )}
      </div>

      {showModal && (
        <Modal onClose={toggleModal}>
          <ModalImage data={modalContent} />
        </Modal>
      )}

      <Toaster
        toastOptions={{
          position: 'bottom-left',
          style: {
            borderRadius: '10px',
            background: '#000000',
            color: '#fff',
          },
        }}
      />
    </>
  );
};

export default App;
