import AccumulationFunctionVisualizer from "@/components/visualizers/AccumulationFunctionVisualizer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
        <AccumulationFunctionVisualizer />
      </div>
    </main>
  );
}
