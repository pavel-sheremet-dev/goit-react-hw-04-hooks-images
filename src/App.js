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

const rTypes = {
  set: 'set',
  add: 'add',
};

const galleryItemsReducer = (
  state = [],
  { type = rTypes.set, payload = [] },
) => {
  switch (type) {
    case rTypes.set:
      return payload;
    case rTypes.add:
      return [...state, ...payload];
    default:
      console.log('unknown type on galleryItemsReducer');
      break;
  }
};

const App = () => {
  const [page, setPage] = useState(api.firstPage);
  const [query, setQuery] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [galleryItems, dispatch] = useReducer(galleryItemsReducer, []);
  const [modalContent, setModalContent] = useState(null);

  const [idElToScroll, setIdElToScroll] = useState(null);
  const [elToScroll, setElToScroll] = useState(null);

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
      setLoading(true);

      try {
        const data = await api.fetchPictures(query, page);

        if (!data.hits.length) {
          toast('not found photos');
          dispatch({ type: rTypes.set, payload: [] });
          isLastPage.current = true;
          return;
        }

        isLastPage.current = api.countTotalResults(page) >= data.totalHits;

        const normalizeData = api.getNormalizeData(data);

        const reduserType = page === api.firstPage ? rTypes.set : rTypes.add;
        dispatch({ type: reduserType, payload: normalizeData });

        if (page !== api.firstPage) {
          setIdElToScroll(data.hits[0].id);
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

  useEffect(() => {
    elToScroll?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [elToScroll]);

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
              idElToScroll={idElToScroll}
              getElToScroll={setElToScroll}
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
          <>
            <Loader />
          </>
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
