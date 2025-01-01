import { Routes, Route } from 'react-router-dom';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import SignInForm from './_auth/forms/SignInForm';
import SignUpForm from './_auth/forms/SignUpForm';
import { Home } from './_root/pages';
import Explore from './_root/pages/Explore';
import Saved from './_root/pages/Saved';
import AllUsers from './_root/pages/AllUsers';
import CreatePost from './_root/pages/CreatePost';
import EditPost from './_root/pages/EditPost';
import PostDetails from './_root/pages/PostDetails';
import Profile from './_root/pages/Profile';
import UpdateProfile from './_root/pages/UpdateProfile';
import LikedPosts from './_root/pages/LikedPosts';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';

const App = () => {
  return (
    <main className='flex h-screen'>
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path='/sign-in' element={<SignInForm />} />
          <Route path='/sign-up' element={<SignUpForm />} />
        </Route>
        {/* private routes */}
        <Route element={<RootLayout />} >
          <Route index element={<Home />} />
          <Route path='/explore' element={<Explore />} />
          <Route path='/saved' element={<Saved />} />
          <Route path='/all-users' element={<AllUsers />} />
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:id' element={<EditPost />} />
          <Route path='/posts/:id' element={<PostDetails />} />
          <Route path='/profile/:id/*' element={<Profile />} />
          <Route path='/update-profile/:id' element={<UpdateProfile />} />
          <Route path='/liked' element={<LikedPosts />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
};

export default App;
