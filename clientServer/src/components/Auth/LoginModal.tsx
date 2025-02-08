import { FormItem } from "@/common/FormItem";
import ModalWithChildren from "@/common/ModalWithChildren";
import { loginSchema, LoginSchema } from "@/schemas/LoginSchema";
import { useAuthStore } from "@/store/useAuthStore";
import { useUser } from "@/store/UserStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw, Send, UserPlus } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
const LoginModal = () => {
  const methods = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });
  const { setLoginModalOpen, setRegisterModalOpen } = useAuthStore();
  const { setIsLoggedIn, setForgottenPassOpen } = useUser();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit: any = (values: LoginSchema) => {
    console.log("values :>> ", values);
    setIsLoggedIn(true);

    if (Object.keys(methods.formState.errors).length === 0) {
      methods.reset();
      setLoginModalOpen(false);
    }
  };

  return (
    <ModalWithChildren
      onClose={() => {
        setLoginModalOpen(false);
      }}
      size="medium"
    >
      <div className="    z-20 flex flex-col gap-4 items-center justify-center w-full font-glory ">
        <div className="flex flex-col gap-4 items-center justify-center p-6 md:p-8 w-full ">
          <h1 className="text-3xl font-bold">Login</h1>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 w-full"
            >
              {/* First row */}
              <div className="flex flex-col md:flex-row gap-4 w-full justify-between">
                <FormItem
                  name="email"
                  label={"email"}
                  className="md:w-full"
                  inputClass="py-4 min-h-12"
                  placeholder="email"
                  required
                  labelClass="uppercase"
                />
              </div>
              {/* second row */}
              <div className="flex flex-col md:flex-row gap-4 w-full justify-between">
                <FormItem
                  name="password"
                  type="password"
                  label={"password"}
                  className="md:w-full"
                  inputClass="py-4 min-h-12"
                  placeholder="password"
                  required
                  labelClass="uppercase"
                />
              </div>

              {/* Third row */}
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
                <button
                  onClick={() => {
                    setLoginModalOpen(false);
                    setForgottenPassOpen(true);
                  }}
                  className="flex flex-row items-center bg-forgottenPass border border-border px-4 py-2 text-white font-semibold"
                >
                  <RotateCcw
                    className="h-4 w-4 mr-2 text-secondary"
                    strokeWidth={3}
                  />
                  Reset Your Password?
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
        <>
          <div className="w-full h-full flex flex-row items-center justify-around gap-6 md:gap-12  md:flex-row p-4 md:p-8">
            <p className="text-black"> Dont Have An Account?</p>
            <button
              onClick={() => {
                setLoginModalOpen(false);
                setRegisterModalOpen(true);
              }}
              className="flex flex-row gap-2 items-center bg-primary border border-border px-4 py-2 text-white font-semibold"
            >
              <UserPlus
                className="h-4 w-4 mr-2 text-secondary"
                strokeWidth={3}
              />
              Register
            </button>
          </div>
        </>
      </div>
    </ModalWithChildren>
  );
};

export default LoginModal;
