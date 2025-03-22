"use client";

import CreateColumn from "@/components/modals/create-column";
import CreateTask from "@/components/modals/create-task";
import EditTask from "@/components/modals/edit-task";

const ModalProvider = () => {
  return (
    <>
      <CreateTask />
      <EditTask />
      <CreateColumn />
    </>
  );
};

export default ModalProvider;
