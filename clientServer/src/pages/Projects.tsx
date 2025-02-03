import { useNavigate } from "react-router-dom";
import { useUser } from "../store/UserStore";
const Projects = () => {
  const navigate = useNavigate();
  // TODO: id user should come from token later
  const { projects, setDialogOpen } = useUser();
  const adminUser = projects.filter((project) =>
    project.team.members.some((member) => member.role.role === "admin")
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
                      <td
                        className="cursor-pointer underline w-[12%] px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/team/${project.team.id}`);
                        }}
                      >
                        {project.team.name}
                      </td>
                      <td className="underline cursor-pointer w-[13%] px-2">
                        {Array.isArray(project.projectOwner)
                          ? project.projectOwner
                              .map((owner) => owner.id)
                              .join(", ")
                          : project.projectOwner?.name}
                      </td>
                      {adminUser && (
                        <>
                          <td className=" w-[13%] px-2">
                            {project.isDeleted ? "inActive" : "Active"}
                          </td>
                          <td className=" w-[12%] px-2">
                            <div className="flex flex-col py-2 gap-2">
                              <button className="bg-background text-white border border-border  p-2 outline-none">
                                Update
                              </button>
                              <button className="bg-lightError text-white border border-border  p-2 outline-none">
                                Delete
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
