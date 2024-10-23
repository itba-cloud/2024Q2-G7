import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from "./pages/Landing";
import UserPage from "./pages/Profile/UserPage";
import UserProfile from "./pages/Profile/UserProfile";
import UserExperiences from "./pages/Profile/UserExperiences";
import UserTrips from './pages/Profile/UserTrips';
import UserFavourites from "./pages/Profile/UserFavourites";
import UserReviews from "./pages/Profile/UserReviews";
import Experiences from "./pages/Experiences/Experiences";
import Agents from "./pages/Agents/Agents";
import AgentDetails from './pages/Agents/AgentDetails';
import ExperienceDetails from "./pages/Experiences/ExperienceDetails";
import ExperienceForm from "./pages/Experiences/ExperienceForm";
import Error from "./pages/Error";
import Custom404 from "./pages/Custom404";
import Home from "./pages/Home";
import { AuthProvider } from './context/AuthProvider';
import Login from "./pages/Login";
import Register from "./pages/Register";
import ConfirmEmail from "./pages/ConfirmEmail";
import RequireAuth from "./components/RequireAuth";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from "react-toastify";
import { paths } from "./common";
import RequireNoAuth from "./components/RequireNoAuth";
import TripDetails from './pages/Profile/TripDetails';
import AdminPage from './pages/Admin/AdminPage';
import AdminExperienceDetails from './pages/Admin/AdminExperienceDetails';
import AdminAgentDetails from './pages/Admin/AdminAgentDetails';
import UserArticles from './pages/Profile/UserArticles';

function App() {
    const categoryProp = useState<string | undefined>(undefined)
    //const nameProp = useState<string | undefined>(undefined)

    return (
        <AuthProvider>
            <BrowserRouter basename={paths.LOCAL_BASE_URL}>

                <Navbar categoryProp={categoryProp} /* nameProp={nameProp} */ />
                <hr className="separator" />

                <Routes>
                    <Route path='/' element={<Landing />}>
                        <Route index element={<Home />} />
                    </Route>
                    <Route path='/user' element={<UserPage />}>
                        <Route path='profile' element={<UserProfile />} />
                        <Route path='experiences' element={<UserExperiences />} />
                        <Route path='trips' element={<UserTrips />} />
                        <Route path='trips/:tripId' element={<TripDetails />} />
                        <Route path='favourites' element={<UserFavourites />} />
                        <Route path='reviews' element={<UserReviews />} />
                        <Route path='articles' element={<UserArticles />} />
                    </Route>
                    <Route path='/admin' element={<AdminPage />}>
                        <Route path='experiences/:experienceId' element={<AdminExperienceDetails />} />
                        <Route path='agents/:agentId' element={<AdminAgentDetails />} />
                    </Route>
                    <Route path='/agents' element={<Agents />} />
                    <Route path='/agents/:agentId' element={<AgentDetails />} />
                    <Route path='/experiences' element={<Experiences categoryProp={categoryProp} /* nameProp={nameProp} */ />} />
                    <Route path='/experiences/:experienceId' element={<ExperienceDetails /* categoryProp={categoryProp} */ /* nameProp={nameProp} */ />} />
                    <Route path='/experienceForm' element={<RequireAuth><ExperienceForm /></RequireAuth>} />
                    <Route path='error' element={<Error />} />
                    <Route path='*' element={<Custom404 />} />
                    <Route path='/login' element={<RequireNoAuth><Login /></RequireNoAuth>} />
                    <Route path='/register' element={<RequireNoAuth><Register /></RequireNoAuth>} />
                    <Route path='/confirmEmail' element={<RequireNoAuth><ConfirmEmail /></RequireNoAuth>} />
                </Routes>

                <ToastContainer position='top-left' autoClose={5000} hideProgressBar={false}
                    newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable />

                <Footer />

            </BrowserRouter>
        </AuthProvider>
    )
}

export default App;
