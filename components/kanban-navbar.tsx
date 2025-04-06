import FlowboardLogo from "./flowboard-logo";
import KanbanAdd from "./kanban-add";
import KanbanSettings from "./kanban-settings";
import { ModeToggle } from "./mode-toggle";

const KanbanNavbar = () => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4">
      <FlowboardLogo />
      <div className="flex items-center gap-2">
        <KanbanAdd />
        <KanbanSettings />
        <ModeToggle />
      </div>
    </div>
  );
};

export default KanbanNavbar;
