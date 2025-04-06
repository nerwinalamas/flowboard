import KanbanBoard from "@/components/kanban-board";
import KanbanFilter from "@/components/kanban-filter";
import KanbanNavbar from "@/components/kanban-navbar";

const Home = () => {
  return (
    <main className="w-full h-screen mx-auto py-6 px-4 flex flex-col">
      <KanbanNavbar />
      <KanbanFilter />
      <div className="flex-1 overflow-x-auto">
        <KanbanBoard />
      </div>
    </main>
  );
};

export default Home;
