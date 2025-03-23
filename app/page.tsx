import KanbanBoard from "@/components/kanban-board";
import KanbanNavbar from "@/components/kanban-navbar";

const Home = () => {
  return (
    <main className="container h-screen mx-auto py-6 px-4 flex flex-col gap-8">
      <KanbanNavbar />
      <div className="flex-1 overflow-x-auto">
        <KanbanBoard />
      </div>
    </main>
  );
};

export default Home;
