import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WaqtProvider } from "./WaqtContext";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { Quotes } from "./components/Quotes";
import { Quran } from "./components/Quran";
import { Duas } from "./components/Duas";
import { Tools } from "./components/Tools";
import { NamesOfAllah } from "./components/NamesOfAllah";
import { PrayerTimes } from "./components/PrayerTimes";

export default function App() {
  return (
    <WaqtProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="quotes" element={<Quotes />} />
            <Route path="quran" element={<Quran />} />
            <Route path="duas" element={<Duas />} />
            <Route path="tools" element={<Tools />} />
            <Route path="names" element={<NamesOfAllah />} />
            <Route path="prayer-times" element={<PrayerTimes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WaqtProvider>
  );
}
