import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[380px] p-4 border-r overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Controls</h2>
          {/* All the settings, prompts, and buttons will go here */}
        </aside>
        <main className="flex-1 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Output</h2>
          {/* The generated images and videos will be displayed here */}
        </main>
      </div>
    </div>
  );
}
