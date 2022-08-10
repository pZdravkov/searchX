import { createGlobalStyle } from "styled-components/macro";
import { normalize, rgba } from "polished";

export const theme = {
  boxShadow: `${rgba("#000", 0.1)} 0 2px 5px`,
  boxShadowHover: `${rgba("#000", 0.2)} 0 2px 10px`,
  transition: "cubic-bezier(0.35, 0, 0.25, 1)",
  colors: {
    secondaryBody: rgba(0, 0, 0, 0.6),
    borderColor: rgba("#979797", 0.4),
  },
};

export const GlobalStyle = createGlobalStyle`
    ${normalize()}

    body {
      font-family: Manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.43;
      color: rgba(0,0,0,0.8)
      position: relative;
      min-height: 100vh;
    }
  
    * {
      box-sizing: border-box;
    }
  `;
