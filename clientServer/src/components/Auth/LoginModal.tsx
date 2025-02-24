import { FormItem } from "@/common/FormItem";
import ModalWithChildren from "@/common/ModalWithChildren";
import { loginSchema, LoginSchema } from "@/schemas/LoginSchema";
import { useAuthStore } from "@/store/useAuthStore";
import { useUser } from "@/store/UserStore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader, RotateCcw, Send, UserPlus } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { toast } from "sonner";

interface DecodedToken {
  userId: string;
  exp?: number;
}

const LoginModal = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const methods = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });
  const { setLoginModalOpen, setRegisterModalOpen } = useAuthStore();
  const { setIsLoggedIn, setForgottenPassOpen } = useUser();

  const onSubmit = async (values: LoginSchema) => {
    setLoading(true);
    setErrorMessage(null);
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/users/login`,
        values
      );
  
      const token = response.data.token;
      if (!token) {
        setErrorMessage("Login Failed: Check Your Email Or Password And Try Again");
        toast.error("Login failed", {
          description: "Invalid email or password. Please try again.",
        });
        return;
      }
  
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        if (!decodedToken.userId) {
          setErrorMessage("Login Error: Check Your Email Or Password And Try Again");
          toast.error("Login error", {
            description: "Something went wrong while verifying your account.",
          });
          return;
        }
  
        localStorage.setItem("userId", decodedToken.userId);
        localStorage.setItem("authToken", token);
        setLoginModalOpen(false);
        setIsLoggedIn(true);
  
        // Success toast
        toast.success("Login successful", {
          description: "Welcome back!",
        });
  
      } catch (decodeError) {
        setErrorMessage(`Error decoding token: ${decodeError}`);
        toast.error("Token error", {
          description: "Failed to verify user identity.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Login Error: Check Your Email Or Password And Try Again.");
      toast.error("Login failed", {
        description: "Please check your credentials and try again.",
      });
    }
  
    setLoading(false);
    if (Object.keys(methods.formState.errors).length === 0) {
      methods.reset();
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
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
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
                  onClick={() => {
                    setLoginModalOpen(false);
                    setForgottenPassOpen(true);
                  }}
                  className="flex flex-row items-center bg-transparent text-base  px-4 py-2 text-text "
                >
                  <RotateCcw
                    className="h-4 w-4 mr-2 text-text"
                    strokeWidth={3}
                  />
                  Reset Your Password?
                </button>
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
                  {loading ? <Loader/> : "Confirm"}
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
