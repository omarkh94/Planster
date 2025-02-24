/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { useUser } from "../store/UserStore";
import { ListRestart, ListX } from "lucide-react";
import { useProject } from "@/store/useProject";
import { useEffect, useState } from "react";
import axios from "axios";

const Projects = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");
  const { setDialogOpen } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { projects, setProjects } = useProject();
  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/projects/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProjects(response.data.data.projects);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError("Failed to load projects. Please try again later.");
      console.error("error :>> ", error);
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      } else {
        alert(error.message);
      }
    }
  };
  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, token, setProjects]);

  return (
    <div className="flex flex-col items-center gap-12">
      <h1 className="text-4xl font-bold font-caveat">Projects</h1>

      <div className="max-w-[90vw] w-full  overflow-x-scroll">
        <table className="w-full">
          <thead>
            <tr className="bg-primary py-2 h-12 text-white text-nowrap text-base">
              <th className="w-[15%] text-start px-2">Title</th>
              <th className="w-[25%] text-start px-2">Description</th>
              <th className="w-[13%] text-start px-2">Deadline</th>
              <th className="w-[12%] text-start px-2">Team Name</th>
              <th className="w-[13%] text-start px-2">Owner</th>
              <th className="w-[13%] text-start px-2">Status</th>
              <th className="w-[12%] text-start px-2">Action</th>
            </tr>
          </thead>

          <tbody className="text-base font-light">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center text-xl">
                  Loading projects...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="text-center text-xl text-red-600">
                  {error}
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-xl">
                  No projects available
                </td>
              </tr>
            ) : (
              projects.map((project: any) => {
                return !project.project?.isDeleted ? (
                  <tr key={project?._id} className="bg-white hover:bg-gray-100">
                    <td
                      className="ps-2 underline cursor-pointer w-[12%] px-2 truncate"
                      onClick={() => navigate(`/project/${project?._id}`)}
                    >
                      {project?.title}
                    </td>
                    <td className="max-w-4 w-[25%] px-2   truncate">
                      {project?.description}
                    </td>
                    <td className="w-[13%] px-2">
                      {project?.expectedDeadLine
                        ? new Date(
                            project?.expectedDeadLine
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="w-[12%] px-2">
                      <span
                        className="cursor-pointer underline text-blue-600 hover:text-blue-800 block"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/team/${project.team._id}`);
                        }}
                      >
                        {project.team.name}
                      </span>
                    </td>

                    <td className="underline cursor-pointer w-[13%] px-2">
                      {project?.projectOwner?.firstName}
                    </td>
                    <td className="w-[13%] px-2">
                      {project.isDeleted ? "inActive" : "Active"}
                    </td>
                    <>
                      <td className="w-[12%] px-2">
                        {project?.projectOwner._id == userId && (
                          <div className="flex flex-col py-2 gap-2">
                            <button
                              className="flex flex-row items-center gap-2 bg-secondary text-primary border py-1 px-3 border-border p-2 outline-none font-semibold"
                              onClick={() => {}}
                            >
                              <ListRestart
                                className="h-5.5 w-5.5 mr-0 lg:mr-2 text-primary"
                                strokeWidth={3}
                              />
                              <span className="hidden px-1 lg:flex">
                                Update
                              </span>
                            </button>
                            <button
                              className="flex flex-row items-center gap-2 bg-danger text-secondary border py-1 px-3 border-border p-2 outline-none font-semibold"
                              onClick={() => {}}
                            >
                              <ListX
                                className="h-5.5 w-5.5 mr-0 lg:mr-2 text-secondary"
                                strokeWidth={3}
                              />
                              <span className="hidden px-1 lg:flex">
                                Delete
                              </span>
                            </button>
                          </div>
                        )}
                      </td>
                    </>
                  </tr>
                ) : null;
              })
            )}
          </tbody>
        </table>
      </div>

      <button
        className=" text-white p-2 rounded-md hover:bg-primary
        bg-primary/70"
        onClick={() => {
          setDialogOpen(true);
        }}
      >
        Create New Project
      </button>
    </div>
  );
};

export default Projects;
