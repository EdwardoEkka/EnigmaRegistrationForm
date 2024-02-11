import "./App.css";
import Welcome from "./components/welcome";
import Form from "./components/form";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Welcome/>}/>
          <Route path="/form" element={<Form/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
