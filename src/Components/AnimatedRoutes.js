import {Route,Routes, useLocation} from 'react-router-dom';
import Home from './Pages/Home/Home';
import Messages from './Sidebar/Components/Messages';
import Search from './Sidebar/Components/Search';
import Explore from './Sidebar/Components/Explore';
import Profile from './Sidebar/Components/Profile';
import Reels from './Sidebar/Components/Reels';
import Notifications from './Sidebar/Components/Notifications';
// eslint-disable-next-line

import { AnimatePresence } from 'framer-motion';

function AnimatedRoutes  ()  {
  const location = useLocation();
  
  return (
     <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route exact path='/' element={<Home/> }/> 
          <Route exact path='/search' element={<Search/> }/> 
          <Route exact path='/explore' element={<Explore/> }/> 
          <Route exact path='/messages' element={<Messages/> }/> 
          <Route exact path='/notifications' element={<Notifications/> }/> 
          <Route exact path='/reels' element={<Reels/> }/> 
          <Route exact path='/profile' element={<Profile/> }/> 
        </Routes>
     </AnimatePresence>
   
  )
}

export default AnimatedRoutes