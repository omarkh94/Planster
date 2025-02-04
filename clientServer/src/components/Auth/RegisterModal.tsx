import { FormItem } from "@/common/FormItem";
import { MobileAndCountryCodeFormInput } from "@/common/MobileAndCountryCodeFormInput";
import ModalWithChildren from "@/common/ModalWithChildren";
import { countries } from "@/mock";
import { registerSchema, RegisterSchema } from "@/schemas/RegisterSchema";
import { useAuthStore } from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const { setRegisterModalOpen } = useAuthStore();
  const onSubmit = (values: RegisterSchema) => {
    console.log("values :>> ", values);
  };
  console.log("methods.register() :>> ", methods.formState.errors);

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
        <div className="flex flex-col gap-4 items-center justify-center p-6 md:p-8 w-full">
          <h1 className="text-3xl font-bold">Register</h1>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 w-full"
            >
              <div className="flex flex-row  items-center justify-center w-full "></div>
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
                  className="bg-primary border border-border px-6 py-2 text-white font-semibold"
                  type="submit"
                  onClick={methods.handleSubmit(onSubmit)}
                  autoFocus
                >
                  Send
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
        <div className="w-full h-full flex items-center justify-center gap-6 md:gap-12 flex-col md:flex-row p-4 md:p-8">
          <p className="text-black"> Already Have An Account?</p>
          <button
            onClick={() => {}}
            className="bg-primary border border-border px-6 py-2 text-white font-semibold"
          >
            Login
          </button>
        </div>
      </div>
    </ModalWithChildren>
  );
};

export default RegisterModal;
