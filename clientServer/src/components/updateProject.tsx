import { FormItem } from "@/common/FormItem";
import ModalWithChildren from "@/common/ModalWithChildren";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Send } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import { ProjectSchema, projectSchema } from "@/schemas/updateProject";
import { useUser } from "@/store/UserStore";
import { toast } from "sonner";

interface UpdateProjectProps {
  projectId: string;
  initialName: string;
  onClose: () => void;
}

const UpdateProject = ({ projectId, initialName, onClose }: UpdateProjectProps) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setUpdateProjectModal } = useUser();

  const methods = useForm<ProjectSchema>({
    resolver: zodResolver(projectSchema),
    mode: "onChange",
    defaultValues: {
      name: initialName
    },
  });

  useEffect(() => {
    methods.reset({ name: initialName });
  }, [initialName, methods]);

  const onSubmit = async (values: ProjectSchema) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/projects/modify/${projectId}`,
        { name: values.name }, 
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUpdateProjectModal(false);
        toast.success("Project Updated Successfully") 
      }
    } catch (error) {
      console.error("Update error:", error);
      setErrorMessage(
        (axios.isAxiosError(error) && error.response?.data?.message) ||
        toast.error("An error occurred while updating the project")
      );
    } finally {
      setLoading(false);
      setUpdateProjectModal(false);
        onClose();
    }
  };

  return (
    <ModalWithChildren
      onClose={() => {
        setUpdateProjectModal(false);
        onClose();
      }}
      size="small"
    >
      <div className="z-20 flex flex-col gap-4 items-center justify-center w-full font-glory">
        <div className="flex flex-col gap-4 items-center justify-center p-6 md:p-8 w-full">
          <h1 className="text-3xl font-bold">Update Project Name</h1>
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 w-full"
            >
              <div className="flex flex-col md:flex-row gap-4 w-full justify-between">
                <FormItem
                  name="name" 
                  label="Project Name"
                  className="w-full"
                  inputClass="py-4 min-h-12"
                  placeholder="Enter project name"
                  required
                  labelClass="uppercase"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-end items-center">
                <button
                  className="flex flex-row gap-2 items-center bg-primary border border-border px-4 py-2 text-white font-semibold"
                  type="submit"
                  disabled={loading}
                >
                  <Send className="h-4 w-4 mr-2 text-secondary" strokeWidth={3} />
                  {loading ? <Loader className="animate-spin" /> : "Update Name"}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </ModalWithChildren>
  );
};

export default UpdateProject;