import "./App.css";
import Router from "./routes/router";
import { CharacterProvider } from "./contexts/CharacterContext";
import { DiaryDraftProvider } from "./contexts/DiaryDraftContext";
import { FrameTemplateMockProvider } from "./contexts/FrameTemplateMockProvider";

function App() {
  return (
    <CharacterProvider>
      <DiaryDraftProvider>
        <FrameTemplateMockProvider>
          <Router />
        </FrameTemplateMockProvider>
      </DiaryDraftProvider>
    </CharacterProvider>
  );
}

export default App;
