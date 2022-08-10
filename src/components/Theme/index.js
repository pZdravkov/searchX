import { ThemeProvider } from "styled-components";

import { GlobalStyle, theme } from "./theme";

const Theme = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};

export default Theme;
