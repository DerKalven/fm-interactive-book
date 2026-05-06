import { AccumulationFunctionVisualizer } from "@/components/visualizers/AccumulationFunctionVisualizer";

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-8 md:px-8 md:py-12">
      <AccumulationFunctionVisualizer
        principal={1000}
        rate={0.05}
        timeHorizon={10}
        selectedTime={10}
        model="both"
      />
    </main>
  );
}
