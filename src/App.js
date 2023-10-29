import "bootstrap/dist/css/bootstrap.css";
import "../src/App.css";
import { BrowserRouter as Router, Routes } from "react-router-dom";
//eslint-disable-next-line
import Home from "./Components/MainScreen/Home";
import Sidebar from "./Components/Sidebar/Main";

function App() {
  return (
    <>
      <div className="App d-inline">
        <Router>
          <div className="mx-3 col-2" id="main">
            <Sidebar />
          </div>
          <Routes>
            {/* <Route exact path="/" element={<Home />}></Route> */}
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
