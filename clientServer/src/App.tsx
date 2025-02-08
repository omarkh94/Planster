import { Route, Routes } from "react-router-dom";
import CreateProject from "./common/CreateProject";
import NavLayout from "./components/nav";
import { KanbanProvider } from "./Context/KanbanContext";
import ContactSupport from "./pages/ContactSupport";
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";
import Project from "./pages/project";
import Projects from "./pages/Projects";
import TeamTable from "./pages/TeamTable";
import { useUser } from "./store/UserStore";
import { useAuthStore } from "./store/useAuthStore";
import RegisterModal from "./components/Auth/RegisterModal";
import ChatRoom from "./pages/ChatRoom";
import LoginModal from "./components/Auth/LoginModal";
import ForgottenPass from "./components/ForgottenPass";

const App = () => {
  const { dialogOpen, forgottenPassOpen } = useUser();
  const { registerModalOpen, loginModalOpen , profileModalOpen } = useAuthStore();
  // const userId = localStorage.getItem("userId")
  const userId = "67a35b4d278aa17859d83045"
  return (
    <KanbanProvider>
      <NavLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:id" element={<Project />} />
          <Route path="/team/:teamId" element={<TeamTable />} />
          <Route path="/info" element={<ContactSupport />} />
          <Route path="/conversation" element={<ChatRoom />} />
          <Route
            path="*"
            element={
              <div>
                <p>Sorry there is no route matches</p>
              </div>
            }
          />
        </Routes>
        {dialogOpen && <CreateProject />}
        {registerModalOpen && <RegisterModal />}
        {profileModalOpen && <Profile userId={userId ?? ""} />}
        {loginModalOpen && <LoginModal />}
        {forgottenPassOpen && <ForgottenPass />}
      </NavLayout>
    </KanbanProvider>
  );
};

export default App;
