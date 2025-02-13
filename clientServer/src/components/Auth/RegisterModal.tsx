import { FormItem } from "@/common/FormItem";
import { MobileAndCountryCodeFormInput } from "@/common/MobileAndCountryCodeFormInput";
import ModalWithChildren from "@/common/ModalWithChildren";
import { countries } from "@/mock";
import { registerSchema, RegisterSchema } from "@/schemas/RegisterSchema";
import { useAuthStore } from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { KeyRound, Send } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
const RegisterModal = () => {
  const methods = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      mobileNumber: {
        countryCode: countries[0]?.dialCode,
        number: "",
      },
    },
  });
  const { setRegisterModalOpen, setLoginModalOpen } = useAuthStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit: any = async (values: RegisterSchema) => {
    const { countryCode, number } = values.mobileNumber;
    const formattedPhoneNumber = `${countryCode}-${number}`;
    const submitData = {
      ...values,
      phoneNumber: formattedPhoneNumber,
      firstName: values.name,
      projects: [],
    };
    console.log("submitData :>> ", submitData);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/users/register`,
        submitData
      );
      alert("Registration successful! Please log in.");
      
      console.log('submitData :>> ', submitData);
      // Reset the form
      methods.reset();
      setRegisterModalOpen(false);
      setLoginModalOpen(true);
      console.log("response :>> ", response);
    } catch (error) {
      console.log("error :>> ", error);
      if (axios.isAxiosError(error) && error.response) {
        const { message } = error.response.data;

        if (message.includes("Email already exists")) {
          methods.setError("email", {
            type: "manual",
            message: "Email already in use",
          });
        } else {
          alert(message || "Something went wrong, please try again.");
        }
      } else {
        alert("Network error, please try again.");
      }
    }

    console.log("Formatted Values to Submit: ", submitData);

    if (Object.keys(methods.formState.errors).length === 0) {
      methods.reset();
    }
  };

  const onPhoneChange = (name: string, value: string) => {
    methods.setValue(name as keyof RegisterSchema, value);
    methods.trigger(name as keyof RegisterSchema);
  };
  const getValues = (name: string) =>
    methods.getValues(name as keyof RegisterSchema) as string;
  const trigger = (name: string) => {
    methods.trigger(name as keyof RegisterSchema);
  };
  return (
    <ModalWithChildren
      onClose={() => {
        setRegisterModalOpen(false);
      }}
      size="large"
    >
      <div className="    z-20 flex flex-col gap-4 items-center justify-center w-full font-glory ">
        <div className="flex flex-col gap-4 items-center justify-center p-6 md:p-8 w-full ">
          <h1 className="text-3xl font-bold">Register</h1>
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
                />
              </div>
              {/* third row */}
              <div className="flex flex-col md:flex-row gap-4 w-full justify-between">
                <FormItem
                  name="email"
                  label={"email"}
                  className="md:w-1/2"
                  inputClass="py-4 min-h-12"
                  placeholder="email"
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
              setRegisterModalOpen(false);
              setLoginModalOpen(true);
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

export default RegisterModal;
