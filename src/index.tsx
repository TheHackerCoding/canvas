/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';
// import { Debugger } from "solid-debugger";

render(() => {
  return <>
    {/* <Debugger> */}
    <App />
    {/* </Debugger> */}
  </>;
}, document.getElementById('root') as HTMLElement);
