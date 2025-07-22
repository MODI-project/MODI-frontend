import "./App.css";
import Router from "./routes/router";
import { CharacterProvider } from "./contexts/CharacterContext";
import { DiaryDraftProvider } from "./contexts/DiaryDraftContext";

function App() {
  return (
    <CharacterProvider>
      <DiaryDraftProvider>
        <Router />
      </DiaryDraftProvider>
    </CharacterProvider>
  );
}

export default App;
