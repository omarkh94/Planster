"use client";

import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";

export function SonnerDemo() {
  return (
    <>
      <Toaster
        toastOptions={{
          classNames: {
            toast: "bg-blue-500 text-white rounded-lg p-4 shadow-lg",
          },
        }}
      />
      <Button
        variant="outline"
        onClick={() =>
          toast("Uh oh! Something went wrong.", {
            description: "There was a problem with your request.",
          })
        }
      >
        Show Toast
      </Button>
    </>
  );
}
