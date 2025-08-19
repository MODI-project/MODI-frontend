import "./App.css";
import Router from "./routes/router";
import { CharacterProvider } from "./contexts/CharacterContext";
import { DiaryDraftProvider } from "./contexts/DiaryDraftContext";
import { FrameTemplateProvider } from "./contexts/FrameTemplate";
import { GeolocationProvider } from "./contexts/GeolocationContext";
import { AlertBusProvider } from "./contexts/AlertBusContext";
import { NotificationManagerProvider } from "./contexts/NotificationManagerContext";
import DongPopup from "./components/common/DongPopup";

function App() {
  return (
    <CharacterProvider>
      <DiaryDraftProvider>
        <FrameTemplateProvider>
          <AlertBusProvider>
            <GeolocationProvider>
              <NotificationManagerProvider>
                <Router />
              </NotificationManagerProvider>
            </GeolocationProvider>
          </AlertBusProvider>
        </FrameTemplateProvider>
      </DiaryDraftProvider>
    </CharacterProvider>
  );
}

export default App;
