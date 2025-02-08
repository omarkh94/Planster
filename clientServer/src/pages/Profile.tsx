import { FormItem } from "@/common/FormItem";
import { MobileAndCountryCodeFormInput } from "@/common/MobileAndCountryCodeFormInput";
import ModalWithChildren from "@/common/ModalWithChildren";
import { countries, mockData } from "@/mock";
import { profileSchema, ProfileSchema } from "@/schemas/ProfileSchema";
import { useAuthStore } from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Send } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { UserType } from "../types/index";
import { useEffect, useState } from "react";

const Profile = ({ userId }: { userId: string }) => {
  const { setProfileModalOpen } = useAuthStore();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const foundUser = mockData.users.find((user) => user.id === userId);
    if (foundUser) setUser(foundUser);
  }, [userId]);

  const methods = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: { countryCode: countries[0]?.dialCode, number: "" },
    },
  });

  // Update form values when user is set
  useEffect(() => {
    if (user) {
      const phoneParts = user.formattedPhoneNumber
        ? String(user.formattedPhoneNumber).split("-")
        : [];
      methods.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobileNumber: {
          countryCode: phoneParts[0] || countries[0]?.dialCode, // Get the first part as country code
          number:
            (user.formattedPhoneNumber ? String(user.formattedPhoneNumber).split("-") : [])
              .slice(1)
              .join("-") || "",
        },
      });
    }
  }, [user, methods.reset, methods]);

  const onSubmit = (values: ProfileSchema) => {
    if (!user) return; // Prevent submission if user data is not loaded
    const phoneParts = user.formattedPhoneNumber
      ? String(user.formattedPhoneNumber).split("-")
      : [];
    const updatedValues = {
      firstName:
        values.firstName !== user.firstName ? values.firstName : user.firstName,
      lastName:
        values.lastName !== user.lastName ? values.lastName : user.lastName,
      email: values.email !== user.email ? values.email : user.email,
      mobileNumber: {
        countryCode:
          values.mobileNumber.countryCode !==
          String(user.formattedPhoneNumber).split(" ")[0]
            ? values.mobileNumber.countryCode
            : phoneParts[0] || countries[0]?.dialCode,
        number:
          values.mobileNumber.number !==
          String(user.formattedPhoneNumber).split(" ").slice(1).join(" ")
            ? values.mobileNumber.number
            : phoneParts.slice(1).join("-") || "",
      },
    };

    console.log("Final Submitted Values:", updatedValues);

    // Reset form with updated values
    methods.reset(updatedValues);
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
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 w-full"
            >
              {/* First row */}
              <div className="flex flex-col md:flex-row gap-4 w-full justify-between">
                <FormItem
                  name="name"
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
                  className="w-full"
                  inputClass="py-4 min-h-12 w-full "
                  placeholder="Select"
                  required
                  labelClass="uppercase"
                  options={[
                    {
                      label: "Front-end dev",
                      value: "frontend",
                    },
                    {
                      label: "Back-end dev",
                      value: "backend",
                    },
                  ]}
                />
              </div>
              {/* third row */}
              <div className="flex flex-col md:flex-row gap-4 w-full justify-between">
                <FormItem
                  name="email"
                  label={"email"}
                  className="md:w-1/2"
                  inputClass="py-4 min-h-12"
                  placeholder={"email"}
                  value={user?.email}
                  required
                  labelClass="uppercase"
                />
                <MobileAndCountryCodeFormInput
                  onChange={onPhoneChange}
                  values={getValues}
                  errors={methods.formState.errors}
                  trigger={trigger}
                />
              </div>
              {/* fourth row */}
              <div className="flex flex-col md:flex-row gap-4 w-full justify-between">
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
                <FormItem
                  name="confirmPassword"
                  type="password"
                  label={"Confirm Password"}
                  className="md:w-1/2"
                  inputClass="py-4 min-h-12"
                  placeholder="Confirm Password"
                  required
                  labelClass="uppercase"
                />
              </div>
              {/* Fourth row */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center ">
                <button
                  className="flex flex-row gap-2 items-center bg-primary border border-border px-4 py-2 text-white font-semibold"
                  type="submit"
                  onClick={methods.handleSubmit(onSubmit)}
                  autoFocus
                >
                  <Send
                    className="h-4 w-4 mr-2 text-secondary"
                    strokeWidth={3}
                  />
                  Confirm
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
        <div className="w-full h-full flex items-center justify-center gap-6 md:gap-12 flex-col md:flex-row p-4 md:p-8">
          <p className="text-black"> Already Have An Account?</p>
          <button
            onClick={() => {
              setProfileModalOpen(false);
            }}
            className="flex flex-row gap-2 items-center bg-primary border border-border px-4 py-2 text-white font-semibold"
          >
            <KeyRound className="h-4 w-4 mr-2 text-secondary" strokeWidth={3} />
            Login
          </button>
        </div>
      </div>
    </ModalWithChildren>
  );
};

export default Profile;
