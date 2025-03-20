import { FormItem } from "@/common/FormItem";
import { MobileAndCountryCodeFormInput } from "@/common/MobileAndCountryCodeFormInput";
import ModalWithChildren from "@/common/ModalWithChildren";
// import { countries } from "@/mock";
import { profileSchema, ProfileSchema } from "@/schemas/ProfileSchema";
import { useAuthStore } from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Send } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { Country, UserType } from "../types/index";
import { useEffect, useState } from "react";
import axios from "axios";

const countries: Country[] = [
  { code: "US", dialCode: "+1", name: "United States" },
  { code: "JO", dialCode: "+962", name: "Jordan" },
  { code: "CA", dialCode: "+4", name: "Canada" },
  { code: "GB", dialCode: "+44", name: "United Kingdom" },
  { code: "IN", dialCode: "+91", name: "India" },
];




const Profile = () => {
  const { setProfileModalOpen } = useAuthStore();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const userId = localStorage.getItem("userId");
  console.log('userId :>> ', userId);
  
  const fetchUser = async () => {
    if (!userId) return;
    try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/users/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.data) {
          setUser(response.data.data[0]);
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
  useEffect(() => {
    
    fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
console.log('user :>> ', user);
  const methods = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      jobTitle: "",
      mobileNumber: {
        countryCode: "",
        number: "",
      },
    },
  });

  useEffect(() => {
    if (user) {
      console.log('user :>> ', user);
      const phoneParts = user.phoneNumber ? user.phoneNumber.split("-") : [];
      methods.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        jobTitle: user.jobTitle,
        mobileNumber: {
          countryCode: phoneParts[0] || countries[0]?.dialCode,
          number: phoneParts.slice(1).join("-") || "",
        },
      });
    }
  }, [methods, user]);
  
  const onSubmit = async (values: ProfileSchema) => {
    if (!user) return;
    
    const updatedValues = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      jobTitle: values.jobTitle,
      phoneNumber: `${values.mobileNumber.countryCode}-${values.mobileNumber.number}`,
      password: values.password,
    };
    
    console.log('user :>> ', user);
    setLoading(true);
    setErrorMessage(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.log("No token found.");
      }
      const response = await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/users/profile/${userId}`,
        updatedValues,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
        }
      );

      if (response.data.success) {
        alert("Profile updated successfully");
        setProfileModalOpen(false);
      } else {
        setErrorMessage("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("An error occurred while updating your profile.");
    } finally {
      setLoading(false);
    }
  };

  const onPhoneChange = (name: string, value: string) => {
    methods.setValue(name as keyof ProfileSchema, value);
    methods.trigger(name as keyof ProfileSchema);
  };

  const getValues = (name: string) =>
    methods.getValues(name as keyof ProfileSchema) as string;

  const trigger = (name: string) => {
    methods.trigger(name as keyof ProfileSchema);
  };

  return (
    <ModalWithChildren
      onClose={() => {
        setProfileModalOpen(false);
      }}
      size="large"
    >
      <div className="    z-20 flex flex-col gap-4 items-center justify-center w-full font-glory ">
        <div className="flex flex-col gap-4 items-center justify-center p-6 md:p-8 w-full ">
          <h1 className="text-3xl font-bold">Update Your Profile</h1>
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 w-full"
            >
              {/* First row */}
              <div className="flex flex-col md:flex-row gap-4 w-full justify-between">
                <FormItem
                  name="firstName"
                  label={"firstName"}
                  className="md:w-1/2"
                  inputClass="py-4 min-h-12"
                  placeholder="firstName"
                  required
                  labelClass="uppercase"
                />
                <FormItem
                  name="lastName"
                  label={"lastName"}
                  className="md:w-1/2"
                  inputClass="py-4 min-h-12"
                  placeholder="lastName"
                  required
                  labelClass="uppercase"
                />
              </div>
              {/* second row */}
              <div className="flex flex-col md:flex-row gap-4 w-full justify-between">
                <FormItem
                  name="jobTitle"
                  label={"Job Title"}
                  type="select"
                  className="md:w-1/2"
                  inputClass="py-4 min-h-12 w-full "
                  placeholder="Select"
                  required
                  labelClass="uppercase"
                  options={[
                    {
                      label: "Frontend Developer",
                      value: "Frontend Developer",
                    },
                    { label: "Backend Developer", value: "Backend Developer" },
                    {
                      label: "Full Stack Developer",
                      value: "Full Stack Developer",
                    },
                    { label: "Software Engineer", value: "Software Engineer" },
                    { label: "UI/UX Developer", value: "UI/UX Developer" },
                    { label: "Web Developer", value: "Web Developer" },
                    {
                      label: "Mobile App Developer",
                      value: "Mobile App Developer",
                    },
                    { label: "DevOps Engineer", value: "DevOps Engineer" },
                    { label: "Cloud Engineer", value: "Cloud Engineer" },
                    { label: "API Developer", value: "API Developer" },
                  ]}
                />{" "}
                <FormItem
                  name="email"
                  disabled
                  label={"email"}
                  className="md:w-1/2"
                  inputClass="py-4 min-h-12"
                  placeholder={"email"}
                  value={user?.email}
                  required
                  labelClass="uppercase"
                />
              </div>
              {/* third row */}
              <div className="flex flex-col md:flex-row gap-4 w-full justify-between">
                <MobileAndCountryCodeFormInput
                  onChange={onPhoneChange}
                  values={getValues}
                  errors={methods.formState.errors}
                  trigger={trigger}
                  autocomplete="tel"
                />{" "}
                <FormItem
                  name="password"
                  type="password"
                  label={"password"}
                  className="md:w-1/2"
                  inputClass="py-4 min-h-12"
                  placeholder="password"
                  required
                  labelClass="uppercase"
                />
              </div>
              {/* Fourth row */}
              <div className="flex flex-col md:flex-row gap-4 justify-end items-center ">
                <button
                  className="flex flex-row gap-2 items-center bg-primary border border-border px-4 py-2 text-white font-semibold"
                  type="submit"
                  disabled={loading}
                  autoFocus
                >
                  <Send
                    className="h-4 w-4 mr-2 text-secondary"
                    strokeWidth={3}
                  />
                  {loading ? <Loader /> : "Confirm"}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </ModalWithChildren>
  );
};

export default Profile;
