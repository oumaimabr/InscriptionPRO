import logo from './logo.svg';
import './App.css';
import "../src/assets/styles/ui.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './views/lp/landingPage';
import StepOne from './views/signup/stepOne';
import StepTwo from './views/signup/stepTwo';
import StepThree from './views/signup/stepThree';
import InfoPerso from './views/signup/infoPerso';
import Confirm from './views/signup/confirm';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/inscription-pro1" element={<StepOne />} />
          <Route path="/inscription-pro2" element={<StepTwo />} />
          <Route path="/inscription-pro3" element={<StepThree />} />
          <Route path="/info-perso" element={<InfoPerso />} />
          <Route path="/Confirmation" element={<Confirm />} />
         </Routes>
         </BrowserRouter>
    </div>
  );
}

export default App;
