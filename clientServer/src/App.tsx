import { Route, Routes } from "react-router-dom";
import CreateProject from "./common/CreateProject";
import NavLayout from "./components/nav";
import { KanbanProvider } from "./Context/KanbanContext";
import ContactSupport from "./pages/ContactSupport";
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import TeamTable from "./pages/TeamTable";
import { useUser } from "./store/UserStore";
import { useAuthStore } from "./store/useAuthStore";
import RegisterModal from "./components/Auth/RegisterModal";
import ChatRoom from "./pages/ChatRoom";
import LoginModal from "./components/Auth/LoginModal";
import ForgottenPass from "./components/ForgottenPass";
import WelcomePage from "./pages/WelcomePage";
// import KanbanBoard from "./components/Kanban/KanbanBoard";
import Project from "./pages/Project";
import { Toaster } from "sonner";


const App = () => {
  const { dialogOpen, forgottenPassOpen } = useUser();
  const { registerModalOpen, loginModalOpen , profileModalOpen } = useAuthStore();
  return (
    <KanbanProvider>
      <NavLayout>
      <Toaster />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:projectId" element={<Project />} />
          <Route path="/team/:teamId" element={<TeamTable />} />
          <Route path="/info" element={<ContactSupport />} />
          <Route path="/conversation/:teamId" element={<ChatRoom />} />
          <Route path="/welcome" element={<WelcomePage />} />
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
        {profileModalOpen && <Profile  />}
        {loginModalOpen && <LoginModal />}
        {forgottenPassOpen && <ForgottenPass />}
      </NavLayout>
    </KanbanProvider>
  );
};

export default App;
