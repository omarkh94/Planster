"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useUser } from "@/store/UserStore";
import {
  MessageSquareText,
  Kanban,
  KeyRound,
  Plus,
  Cog,
  UserPlus,
  DoorOpen,
} from "lucide-react";
import type React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Dropdown } from "antd";
import { ChevronDown } from "lucide-react";

interface Project {
  _id: string;
  title: string;
  team: {
    _id: string;
  };
  isDeleted:boolean;
}

const NavLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { setRegisterModalOpen, setLoginModalOpen, setProfileModalOpen } =
    useAuthStore();
  const { isLoggedIn, setDialogOpen, setIsLoggedIn } = useUser();

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<{ data: { projects: Project[] } }>(
          `${import.meta.env.VITE_APP_API_URL}/projects/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProjects(response.data.data.projects || []);
      } catch (error) {
        console.error("error :>> ", error);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchProjects();
    } else {
      setProjects([]);
      setLoading(false);
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    navigate(`/`);
  };

  const handleProjectSelect = (projectId: string) => {
    const selectedProject = projects.find(
      (project) => project._id === projectId
    );
    if (selectedProject) {
      navigate(`/conversation/${selectedProject.team._id}`);
    }
  };

  const projectMenuItems = projects
  .filter((project) => !project.isDeleted) 
  .map((project) => ({
    key: project._id,
    label: project.title,
    onClick: () => handleProjectSelect(project._id),
  }))

  return (
    <div className="min-h-screen flex flex-col font-glory">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-primary">
        <div className="mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo and Desktop Nav */}
            <div className="flex items-center gap-8">
              <a
                href="/"
                className="font-semibold text-xl text-secondary font-caveat"
              >
                PLANSTER
              </a>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Action Buttons */}
              {isLoggedIn ? (
                <>
                  <Link
                    className="flex flex-row items-center gap-2  bg-secondary rounded-sm py-1 px-1 md:px-3  text-primary font-semibold"
                    to={""}
                    onClick={() => {
                      setDialogOpen(true);
                    }}
                  >
                    <Plus className="h-5.5 w-5.5" strokeWidth={3} />
                    <span className="hidden px-1 lg:flex">Create</span>
                  </Link>
                  <Link
                    to="/projects"
                    className="flex flex-row items-center gap-2  bg-secondary rounded-sm py-1 px-1 md:px-3  text-primary font-semibold"
                  >
                    <Kanban className="h-5.5 w-5.5" strokeWidth={3} />
                    <span className="hidden px-1 lg:flex">Projects</span>
                  </Link>
                  {loading ? (
                    <div>Loading projects...</div>
                  ) : error ? (
                    <div>{error}</div>
                  ) : projects.length > 0  ? (
                    <Dropdown
                      menu={{ items: projectMenuItems }}
                      trigger={["click"]}
                    >
                      <button className="flex flex-row items-center gap-2 bg-secondary rounded-sm py-1 px-1 md:px-3 text-primary font-semibold">
                        <MessageSquareText
                          className="h-5.5 w-5.5 text-primary"
                          strokeWidth={3}
                        />
                        <span className="hidden px-1 lg:flex">Messages</span>
                        <ChevronDown className="h-4 w-4 text-primary" />
                      </button>
                    </Dropdown>
                  ) : null}
                  <button
                    className="flex flex-row items-center gap-2 bg-secondary rounded-sm py-1 px-1 md:px-3 text-primary font-semibold"
                    onClick={() => setProfileModalOpen(true)}
                  >
                    <Cog
                      className="h-5.5 w-5.5 mr-0 lg:mr-2 text-primary"
                      strokeWidth={3}
                    />
                    <span className="hidden px-1 lg:flex">Settings</span>
                  </button>
                  <button
                    className="flex flex-row items-center gap-2 bg-secondary rounded-sm py-1 px-1 md:px-3 text-primary font-semibold"
                    onClick={handleLogout}
                  >
                    <DoorOpen
                      className="h-5.5 w-5.5 mr-0 lg:mr-2 text-primary"
                      strokeWidth={3}
                    />
                    <span className="hidden px-1 lg:flex">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Auth buttons - Desktop */}
                  <div className="flex items-center gap-2">
                    <button
                      className="flex flex-row items-center gap-2 bg-secondary rounded-sm py-1 px-1 md:px-3 text-primary font-semibold"
                      onClick={() => setLoginModalOpen(true)}
                    >
                      <KeyRound
                        className="h-5.5 w-5.5 mr-0 lg:mr-2 text-primary"
                        strokeWidth={3}
                      />
                      <span className="hidden px-1 lg:flex">Login</span>
                    </button>
                    <button
                      className="flex flex-row items-center gap-2  bg-secondary rounded-sm py-1 px-1 md:px-3  text-primary font-semibold "
                      onClick={() => setRegisterModalOpen(true)}
                    >
                      <UserPlus
                        className="h-5.5 w-5.5 mr-0 lg:mr-2 text-primary"
                        strokeWidth={3}
                      />
                      <span className="hidden px-1 lg:flex">Sign up</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      {location.pathname === "/" ? (
        <main className="flex-1 bg-heroBg  bg-cover bg-center flex flex-col items-center justify-center relative font-caveat ">
          {children}
        </main>
      ) : location.pathname === "/conversation" ? (
        <main className="flex-1 bg-secondary w-full h-full flex flex-col  items-center justify-start ">
          {children}
        </main>
      ) : location.pathname === "/welcome" ? (
        <main className="flex-1 bg-[#89a6ac]   bg-cover bg-center  flex flex-col  items-center justify-center  relative  font-caveat  ">
          {children}
        </main>
      ) : (
        <main className="flex-1 bg-gray-300 w-full h-full p-4 ">
          {children}
        </main>
      )}
    </div>
  );
};

export default NavLayout;
