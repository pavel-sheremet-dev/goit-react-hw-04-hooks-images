import { useState, useRef } from 'react';

import PropTypes from 'prop-types';

import { BsSearch } from 'react-icons/bs';
import { AiOutlineDelete } from 'react-icons/ai';

import toast from 'react-hot-toast';

const SearchBar = ({ query, getQuery, getInputRef }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const inputRef = useRef(null);

  const handleSubmit = e => {
    e.preventDefault();
    const normalizedQuery = getNormalizedQuery();
    if (!normalizedQuery) {
      toast('Empty query');
      return;
    }
    if (normalizedQuery === query) {
      toast('Same query');
      return;
    }
    getQuery(searchQuery);
    inputRef.current.blur();
  };

  const handleInputClear = e => {
    setSearchQuery('');
    inputRef.current.focus();
  };

  const handleChange = e => {
    setSearchQuery(e.target.value);
  };

  const getNormalizedQuery = () => {
    return searchQuery.toLowerCase().trim();
  };

  return (
    <header className="Searchbar">
      <form className="SearchForm" onSubmit={handleSubmit}>
        <button type="button" className="SearchForm-button">
          <AiOutlineDelete color="#55555" onClick={handleInputClear} />
        </button>
        <input
          onChange={handleChange}
          className="SearchForm-input"
          type="text"
          value={searchQuery}
          autoComplete="off"
          placeholder="Search photos"
          ref={inputRef}
        />
        <button type="submit" className="SearchForm-button">
          <BsSearch color="#55555" />
        </button>
      </form>
    </header>
  );
};

SearchBar.propTypes = {
  query: PropTypes.string,
  getQuery: PropTypes.func.isRequired,
};

export default SearchBar;
