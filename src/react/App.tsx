const App = () => {

  const maximize = () => {
    // electron/controllers/main.controller.ts -> maximize()
    app.main.maximize();
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Electron Skeleton</h1>
      <h3>Eletron + Forge + Typescript + Vite + React</h3>
      <button onClick={maximize}>Maximize window</button>
    </div>
  );
};

export default App;
