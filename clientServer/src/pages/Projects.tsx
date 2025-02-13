import { useNavigate } from "react-router-dom";
import { useUser } from "../store/UserStore";
import { ListRestart , ListX } from "lucide-react";
const Projects = () => {
  const navigate = useNavigate();
  const { projects, setDialogOpen } = useUser();
  const adminUser = projects.filter((project) =>
    project.members.some((member) => member.role.role === "admin")
  );

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
            {projects.map(
              (project) =>
                !project.isDeleted && (
                  <>
                    <tr key={project.id} className="bg-white hover:bg-gray-100">
                      <td
                        className="ps-2 underline cursor-pointer  w-[12%] px-2"
                        onClick={() => navigate(`/project/${project.id}`)}
                      >
                        {project.title}
                      </td>
                      <td className=" w-[25%] px-2">{project.description}</td>
                      <td className=" w-[13%] px-2">
                        {project.expectedDeadLine.toLocaleDateString()}
                      </td>
                      <td className="w-[12%] px-2">
                        {project.teams.length > 0 ? (
                          project.teams.map((team) => (
                            <span
                              key={team.id}
                              className="cursor-pointer underline text-blue-600 hover:text-blue-800 block"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/team/${team.id}`);
                              }}
                            >
                              {team.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">No teams</span>
                        )}
                      </td>

                      <td className="underline cursor-pointer w-[13%] px-2">
                        {Array.isArray(project.projectOwner)
                          ? project.projectOwner
                              .map((owner) => owner.id)
                              .join(", ")
                          : project.projectOwner?.firstName}
                      </td>
                      {adminUser && (
                        <>
                          <td className=" w-[13%] px-2">
                            {project.isDeleted ? "inActive" : "Active"}
                          </td>
                          <td className=" w-[12%] px-2">
                            <div className="flex flex-col py-2 gap-2">
                              <button
                                className="flex flex-row items-center gap-2 bg-secondary text-primary border py-1 px-3 border-border  p-2 outline-none font-semibold"
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
                                className="flex flex-row items-center gap-2 bg-danger text-secondary border py-1 px-3 border-border  p-2 outline-none font-semibold"
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
                          </td>
                        </>
                      )}
                    </tr>
                    <tr>
                      <td>
                        <div className=" h-[1px] bg-gray-300"></div>
                      </td>
                    </tr>
                  </>
                )
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
