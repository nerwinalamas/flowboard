import FlowboardLogo from "./flowboard-logo";
import KanbanAddButtons from "./kanban-add-buttons";

const KanbanNavbar = () => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4">
      <FlowboardLogo />
      <KanbanAddButtons />
    </div>
  );
};

export default KanbanNavbar;
