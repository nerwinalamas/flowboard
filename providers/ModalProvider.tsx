"use client";

import CreateTask from "@/components/modals/create-task";
import EditTask from "@/components/modals/edit-task";

const ModalProvider = () => {
  return (
    <>
      <CreateTask />
      <EditTask />
    </>
  );
};

export default ModalProvider;
