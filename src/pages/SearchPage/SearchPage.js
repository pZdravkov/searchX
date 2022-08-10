import Autocomplete from "components/Autocomplete";

import {
  Container,
  TitleContainer,
  SearchbarContainer,
} from "./SearchPage.styles";

const SearchPage = () => {
  return (
    <Container>
      <TitleContainer>
        <h1>SearchX Demo</h1>
      </TitleContainer>
      <SearchbarContainer>
        <Autocomplete />
      </SearchbarContainer>
    </Container>
  );
};

export default SearchPage;
