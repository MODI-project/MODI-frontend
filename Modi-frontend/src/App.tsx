import "./App.css";
import Router from "./routes/router";
import { CharacterProvider } from "./contexts/CharacterContext";

function App() {
  return (
    <CharacterProvider>
      <Router />
    </CharacterProvider>
  );
}

export default App;
