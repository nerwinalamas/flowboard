import FlowboardLogo from "./flowboard-logo";
import { ModeToggle } from "./mode-toggle";

const KanbanNavbar = () => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4">
      <FlowboardLogo />
      <ModeToggle />
    </div>
  );
};

export default KanbanNavbar;
