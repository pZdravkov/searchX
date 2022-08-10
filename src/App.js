import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Theme from "components/Theme";

import SearchPage from "pages/SearchPage";
import ResultsPage from "pages/ResultsPage";

const App = () => {
  return (
    <Theme>
      <Router>
        <Routes>
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/" element={<SearchPage />} />
        </Routes>
      </Router>
    </Theme>
  );
};

export default App;
