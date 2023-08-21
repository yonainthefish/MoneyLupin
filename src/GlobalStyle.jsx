import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  :root {
    font-size: 10px;
    font-family: 'Noto Sans KR', sans-serif;
    
    --gray-100: #eee;
    --gray-200: #a7a7a7;
    --gray-300: #7a7a7a;
    --black-color: #232323;

    --error-color: #EB5757;
    --import-color: #d03b3f;

    --brand-color: #7754F3;
    --brand-color-light: #CEC2FD;
  }

  //텍스트 숨김 처리
  .a11y-hidden {
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
    width: 1px;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
  }

  body {
    color: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button, input, textarea {
    padding: 0;
    border: none;
    font-size: inherit;
    font-weight: inherit;
    color: inherit;
    background-color: inherit;
  }

  button {
    cursor: pointer;
  }

  ol, ul, li {
    list-style: none;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
  }

  ul {
    margin: 0;
    padding: 0;
  }
`;

export default GlobalStyle;
