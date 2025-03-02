import KanbanBoard from "@/components/kanban-board";

const Home = () => {
  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-8">FlowBoard</h1>
      <div className="h-full">
        <KanbanBoard />
      </div>
    </main>
  );
};

export default Home;
