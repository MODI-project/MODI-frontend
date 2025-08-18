import "./App.css";
import Router from "./routes/router";
import { CharacterProvider } from "./contexts/CharacterContext";
import { DiaryDraftProvider } from "./contexts/DiaryDraftContext";
import { FrameTemplateProvider } from "./contexts/FrameTemplate";
import { GeolocationProvider } from "./contexts/GeolocationContext";

function App() {
  return (
    <CharacterProvider>
      <DiaryDraftProvider>
        <FrameTemplateProvider>
          <GeolocationProvider>
            <Router />
          </GeolocationProvider>
        </FrameTemplateProvider>
      </DiaryDraftProvider>
    </CharacterProvider>
  );
}

export default App;
