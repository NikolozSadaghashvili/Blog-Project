import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.tsx";
import Home from "./pages/Home.tsx";
import Blog from "./pages/Blog.tsx";
import SinglePost from "./pages/SinglePost.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import CreatePost from "./pages/CreatePost.tsx";
import MyPost from "./pages/MyPost.tsx";
import { Toaster } from "react-hot-toast";
import AdminPanel from "./pages/AdminPanel.tsx";
import UsersPage from "./adminPage/UsersPage.tsx";
import PostPage from "./adminPage/PostPage.tsx";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="bottom-left" />
      <UserProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post" element={<Blog />} />
          <Route path="/post/:id" element={<SinglePost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post/add" element={<CreatePost />} />
          <Route path="/post/my" element={<MyPost />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/posts" element={<PostPage />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;
