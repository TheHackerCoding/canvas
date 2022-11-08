import type { Component } from 'solid-js';
import styles from './App.module.css';
import Canvas from './components/canvas';

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <h1>helwo</h1>
        {/*<Canvas width={window.screen.width / 2} height={window.screen.height / 2} />*/}
        <Canvas width={1280} height={720} />
        {/*<Canvas width={640 * .5} height={480 * .5} />*/}
      </header>
    </div>
  );
};

export default App;
