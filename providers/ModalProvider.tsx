"use client";

import CreateColumn from "@/components/modals/create-column";
import CreateTask from "@/components/modals/create-task";
import DeleteColumn from "@/components/modals/delete-column";
import DeleteTask from "@/components/modals/delete-task";
import EditColumn from "@/components/modals/edit-column";
import EditTask from "@/components/modals/edit-task";
import ShareTask from "@/components/modals/share-task";

const ModalProvider = () => {
  return (
    <>
      <CreateTask />
      <EditTask />
      <DeleteTask />
      <ShareTask />
      <CreateColumn />
      <EditColumn />
      <DeleteColumn />
    </>
  );
};

export default ModalProvider;
