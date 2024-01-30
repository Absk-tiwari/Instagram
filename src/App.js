import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import {ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Home from "./Components/Pages/Home/Home";
import Messages from "./Components/Sidebar/Components/Messages/Messages";
import Search from "./Components/Sidebar/Components/Search";
import Explore from "./Components/Sidebar/Components/Explore";
import Profile from "./Components/Sidebar/Components/Profile";
import Reels from "./Components/Sidebar/Components/Reels";
import Create from "./Components/Pages/Posts/Create";
import Notifications from "./Components/Sidebar/Components/Notifications";
import SidebarComponent from "./Components/SidebarComponent";
import ProfileState from "./Contexts/Profiles/ProfileState";
import PostState from "./Contexts/Profiles/PostState";
import StoryState from "./Contexts/Stories/StoryState";
import Story from "./Components/Pages/Story";
import Login from "./Components/Pages/Auth/Login";
import Signup from "./Components/Pages/Auth/Signup";
import ProfileSetting from "./Components/Pages/Settings/ProfileSetting";
import AuthState from "./Contexts/Auth/AuthState"; 
import Test from "./Components/Test";
function App() {

  return (
    <>
    <Router>
     <AuthState>
      <StoryState>
        <PostState>
          <ProfileState>
            <div className="App" style={{ display: "flex" }}>
                <ToastContainer position='top-center' autoClose={5000} hideProgressBar={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme='dark' />           
                <SidebarComponent />
                {/* <AnimatedRoutes/> */}
                <Routes>
                  <Route exact path="/login" element={<Login />} />
                  <Route exact path="/signup" element={<Signup />} />
                  <Route exact path="/" element={<Home />} />
                  <Route exact path="/search" element={<Search />} />
                  <Route exact path="/explore" element={<Explore />} />
                  <Route exact path="/messages" element={<Messages />} />
                  <Route exact path="/test" element={<Test />} />
                  <Route
                    exact
                    path="/notifications"
                    element={<Notifications />}
                  />
                  <Route exact path="/reels" element={<Reels />} />
                  <Route exact path="/createPost" element={<Create/>} />
                  <Route exact path="/profile" element={<Profile />} />
                  <Route exact path="/edit-profile" element={<ProfileSetting />} />
                  <Route path="/stories/:username/view" element={<Story />} />
                </Routes>
            </div>
          </ProfileState>
        </PostState>
      </StoryState>
     </AuthState>
    </Router>
    </>
  );
}

export default App;
