import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const ModalWithChildren = ({
  onClose,
  children,
  size,
}: {
  onClose: () => void;
  children: React.ReactNode;
  size: "small" | "medium" | "large" | 'extra';
}) => {
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
        <motion.div
          className={`relative bg-white dark:bg-secondary  shadow-lg w-full   mx-auto scrollbar-hide overflow-scroll scroll-smooth ${
            size === "large"
              ? "max-w-[60vw]  max-h-[90vh] min-h-[60vh]"
              : size === "medium"
              ? " sm:max-w-[40vw]  max-h-[50vh] min-h-[80vh]"
              : "max-w-[30vw]  max-h-[30vh] min-h-[30vh]"
          }`}
          initial={{ scale: 0.95, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 50 }}
          transition={{ type: "spring", duration: 1.5 }}
          onClick={handleModalClick}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors bg-white dark:bg-secondary rounded-full p-2 "
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalWithChildren;
