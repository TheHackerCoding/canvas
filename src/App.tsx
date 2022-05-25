import type { Component } from 'solid-js';
import styles from './App.module.css';
import Canvas from './components/canvas';
import Engine from './components/engine';
const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <h1>helwdo</h1>
        <Canvas width={500} height={1000}/>
      </header>
    </div>
  );
};

export default App;
