import { Route, Routes } from "react-router-dom";
import CreateProject from "./common/CreateProject";
import NavLayout from "./components/nav";
import { KanbanProvider } from "./Context/KanbanContext";
import ContactSupport from "./pages/ContactSupport";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Project from "./pages/project";
import Projects from "./pages/Projects";
import Registration from "./pages/Register";
import TeamTable from "./pages/TeamTable";
import { useUser } from "./store/UserStore";

const App = () => {
  const { dialogOpen } = useUser();

  return (
    <KanbanProvider>
      <NavLayout>
        {/* <CollapsedBtn />
      <Nav />
      <CollapsedMenu />
      <SideNaveBtn /> */}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:id" element={<Project />} />
          <Route path="/team/:teamId" element={<TeamTable />} />
          <Route path="/info" element={<ContactSupport />} />
          <Route path="/Profile/:id" element={<Profile />} />
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
      </NavLayout>
    </KanbanProvider>
  );
};

export default App;
