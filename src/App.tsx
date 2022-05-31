import type { Component } from 'solid-js';
import styles from './App.module.css';
import Canvas from './components/canvas';

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <h1>helwo</h1>
        <Canvas width={innerWidth} height={innerHeight} />
      </header>
    </div>
  );
};

export default App;
