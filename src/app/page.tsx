import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col p-8">
      <header className="flex flex-col items-left">
        <h1 className="text-4xl font-bold text-left mb-4">WMATA Route Tools</h1>
      </header>
      <main className="grid grid-cols-2 grid-rows-1 justify-center min-h-screen">
        {/* Route Planner */}
        <Button className="mp-2" asChild>
          <a href="/route-planner">
            Route Planner
          </a>
        </Button>
        {/* Check a route */}
        <Button className="mp-2" asChild>
          <a href="/route-status">
            Check Route Status
          </a>
        </Button>
      </main>
    </div>
  );
}
