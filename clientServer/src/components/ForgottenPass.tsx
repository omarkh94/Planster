import { FormItem } from "@/common/FormItem";
import ModalWithChildren from "@/common/ModalWithChildren";
import { forgottenPassSchema, ForgottenPassSchema } from "@/schemas/ForgottenPassSchema";

import { useUser } from "@/store/UserStore";
import { zodResolver } from "@hookform/resolvers/zod";
import {  Send } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
const ForgottenPass = () => {
  const methods = useForm<ForgottenPassSchema>({
    resolver: zodResolver(forgottenPassSchema),
    mode: "onChange",
  });
  const {  setForgottenPassOpen } = useUser();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit: any = (values: ForgottenPassSchema) => {
    console.log("values :>> ", values);

    if (Object.keys(methods.formState.errors).length === 0) {
      methods.reset();
      setForgottenPassOpen(false);
    }
  };

  return (
    <ModalWithChildren
      onClose={() => {
        setForgottenPassOpen(false);
      }}
      size="small"
    >
      <div className="    z-20 flex flex-col gap-4 items-center justify-center w-full font-glory ">
        <div className="flex flex-col gap-4 items-center justify-center p-6 md:p-8 w-full ">
          <h1 className="text-3xl font-bold">Reset Your Password</h1>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 w-full"
            >
              {/* First row */}
              <div className="flex flex-col md:flex-row gap-4 w-full justify-between">
                <FormItem
                  name="email"
                  label={"enter Your email"}
                  className="md:w-full"
                  inputClass="py-4 min-h-12"
                  placeholder="email"
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
                
              </div>
            </form>
          </FormProvider>
        </div>
        
      </div>
    </ModalWithChildren>
  );
};

export default ForgottenPass;
