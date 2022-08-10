import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import useApi from "services/dummyApi";

import {
  Container,
  InputContainer,
  IconGroup,
  StyledIcon,
  StyledInput,
  OptionsContainer,
  OptionContainer,
  OptionTitle,
  OptionActions,
} from "./Autocomplete.style";

// Real scenario, this would be a reusable component with a very nice API, which
const Autocomplete = ({ defaultQuery }) => {
  const inputRef = useRef(null);

  const {
    inputValue,
    options,
    focused,
    handleChange,
    handleSubmit,
    handleSelect,
    handleClear,
    handleRemove,
    handleFocus,
    handleBlur,
  } = useAutocomplete({
    inputRef,
    defaultQuery,
  });

  const isOpen = focused && !!options.length;

  return (
    <Container open={isOpen}>
      <InputContainer>
        <StyledIcon>
          <span className="material-symbols-outlined">search</span>
        </StyledIcon>
        <StyledInput
          ref={inputRef}
          type="text"
          autoFocus={!defaultQuery}
          value={inputValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyUp={handleSubmit}
        />
        <IconGroup>
          <StyledIcon clickable onClick={handleClear}>
            <span className="material-symbols-outlined">close</span>
          </StyledIcon>
          <StyledIcon>
            <span className="material-symbols-outlined">mic</span>
          </StyledIcon>
        </IconGroup>
      </InputContainer>
      {isOpen && (
        <OptionsContainer>
          {options.map((option) => (
            <OptionContainer
              key={option.show_id}
              onMouseDown={() => handleSelect(option.title)}
            >
              <OptionTitle isSaved={option.isSaved}>
                <StyledIcon>
                  <span className="material-symbols-outlined">
                    {option.isSaved ? "history" : "public"}
                  </span>
                </StyledIcon>
                {option.title}
              </OptionTitle>
              {option.isSaved && (
                <OptionActions
                  onMouseDown={(e) => handleRemove(e, option.title)}
                >
                  Remove
                </OptionActions>
              )}
            </OptionContainer>
          ))}
        </OptionsContainer>
      )}
    </Container>
  );
};

// I prefer to split out complex functions and hooks from the component itself,
// The code is much cleaner and easier to understand

// The functionalities here are very basic, I would avoid implementing anything like this when possible
// but for the sake of the assignment I've kept it as trivial as it could be

const useAutocomplete = ({ inputRef, defaultQuery }) => {
  const [inputValue, setInputValue] = useState(defaultQuery);
  const [options, setOptions] = useState([]);
  const [focused, setFocused] = useState(false);

  // some simple cache to save querying
  const cache = useRef(new Map());

  const navigate = useNavigate();

  const { quickSearch, saveSearch, removeSearch } = useApi();

  const fetchData = useCallback(
    (value) => {
      const query = value?.trim();
      const cached = cache.current.get(query);
      if (cached) return setOptions(cached);
      const results = quickSearch({ query });
      cache.current.set(query, results);
      return setOptions(results);
    },
    [quickSearch]
  );

  const handleChange = useCallback(
    ({ target: { value } }) => {
      setInputValue(value);
      fetchData(value);
    },
    [fetchData]
  );

  const handleSubmit = useCallback(
    ({ key, target: { value } }) => {
      const query = value?.trim();
      if (key === "Enter" && !!query) {
        navigate(`/results?q=${query}&pageSize=10&pageNo=1`);
        saveSearch(query);
        inputRef.current.blur();
      }
    },
    [inputRef, navigate, saveSearch]
  );

  const handleSelect = useCallback(
    (value) => {
      if (!!value) {
        navigate(`/results?q=${value}&pageSize=10&pageNo=1`);
        saveSearch(value);
        setInputValue(value);
      }
    },
    [navigate, saveSearch]
  );

  const handleClear = useCallback(() => {
    setInputValue("");
    inputRef.current.focus();
  }, [inputRef]);

  const handleRemove = useCallback(
    (e, value) => {
      e.preventDefault();
      e.stopPropagation();

      if (!!value) {
        // Invalidate cache
        cache.current.delete(inputValue);
        removeSearch(value);
        fetchData(inputValue);
      }
    },
    [inputValue, removeSearch, fetchData]
  );

  const handleFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setFocused(false);
  }, []);

  useEffect(() => {
    focused && fetchData(inputValue);
  }, [inputValue, focused, fetchData]);

  return {
    inputValue,
    options,
    focused,
    handleChange,
    handleSubmit,
    handleSelect,
    handleClear,
    handleRemove,
    handleFocus,
    handleBlur,
  };
};

Autocomplete.defaultProps = {
  defaultQuery: "",
};

Autocomplete.propTypes = {
  defaultQuery: PropTypes.string,
};

export default Autocomplete;
