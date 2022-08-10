import { useCallback, useRef, useState } from "react";
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
          onChange={(e) => handleChange(e.target.value)}
          onKeyUp={(e) => handleSubmit(e.key, e.target.value)}
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
              <OptionTitle>
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

const useAutocomplete = ({ inputRef, defaultQuery }) => {
  const [inputValue, setInputValue] = useState(defaultQuery);
  const [options, setOptions] = useState([]);
  const [focused, setFocused] = useState(false);

  const cache = useRef(new Map());

  const navigate = useNavigate();

  const { quickSearch, saveSearch, removeSearch } = useApi();

  const handleChange = useCallback(
    (value) => {
      setInputValue(value);
      const query = value?.trim();
      const cached = cache.current.get(query);
      if (cached) return setOptions(cached);
      const results = quickSearch({ query });
      cache.current.set(query, results);
      return setOptions(results);
    },
    [quickSearch]
  );

  const handleSubmit = useCallback(
    (key, value) => {
      const query = value?.trim();
      if (key === "Enter" && !!query) {
        navigate(`/results?q=${query}&pageSize=10&pageNo=1`);
        saveSearch(query);
      }
    },
    [navigate, saveSearch]
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
    inputRef.current.focus();
    setInputValue("");
  }, [inputRef]);

  const handleRemove = useCallback(
    (e, value) => {
      e.preventDefault();
      e.stopPropagation();

      console.log(value);

      if (!!value) {
        // Invalidate cache
        cache.current.delete(inputValue);
        removeSearch(value);
        handleChange(inputValue);
      }
    },
    [inputValue, removeSearch, handleChange]
  );

  const handleFocus = useCallback(() => {
    setFocused(true);
    handleChange(inputValue);
    if (inputValue) return handleChange(inputValue);
  }, [inputValue, handleChange]);

  const handleBlur = useCallback(() => {
    return setFocused(false);
  }, []);

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
