import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WaqtProvider } from "./WaqtContext";
import { UserProvider } from "./contexts/UserContext";
import { TasbihProvider } from "./contexts/TasbihContext";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { Quotes } from "./components/Quotes";
import { Quran } from "./components/Quran";
import { Duas } from "./components/Duas";
import { Tools } from "./components/Tools";
import { NamesOfAllah } from "./components/NamesOfAllah";
import { PrayerTimes } from "./components/PrayerTimes";
import { Journey } from "./components/Journey";
import { Quiz } from "./components/Quiz";
import { TasbihLanding } from "./components/tasbih/TasbihLanding";
import { CustomTasbihList } from "./components/tasbih/CustomTasbihList";
import { CustomTasbihForm } from "./components/tasbih/CustomTasbihForm";
import { PredefinedTasbihList } from "./components/tasbih/PredefinedTasbihList";
import { TasbihCounter } from "./components/tasbih/TasbihCounter";
import { SalahProvider } from "./contexts/SalahContext";
import { SalahTracker } from "./components/SalahTracker";
import { AdhanProvider } from "./contexts/AdhanContext";

export default function App() {
  return (
    <WaqtProvider>
      <UserProvider>
        <SalahProvider>
          <AdhanProvider>
            <TasbihProvider>
              <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="quotes" element={<Quotes />} />
                  <Route path="quran" element={<Quran />} />
                  <Route path="duas" element={<Duas />} />
                  <Route path="salah" element={<SalahTracker />} />
                  <Route path="tools" element={<Tools />} />
                  <Route path="names" element={<NamesOfAllah />} />
                  <Route path="prayer-times" element={<PrayerTimes />} />
                  <Route path="journey" element={<Journey />} />
                  <Route path="quiz" element={<Quiz />} />
                
                {/* Tasbih Module Routes */}
                <Route path="tasbih">
                  <Route index element={<TasbihLanding />} />
                  <Route path="custom">
                    <Route index element={<CustomTasbihList />} />
                    <Route path="new" element={<CustomTasbihForm />} />
                    <Route path=":id" element={<TasbihCounter />} />
                  </Route>
                  <Route path="predefined">
                    <Route index element={<PredefinedTasbihList />} />
                    <Route path=":id" element={<TasbihCounter />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
          </TasbihProvider>
          </AdhanProvider>
        </SalahProvider>
      </UserProvider>
    </WaqtProvider>
  );
}
