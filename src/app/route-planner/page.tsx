import RoutePlannerClient from "@/components/RoutePlannerClient";

export default function PlanRoute() {
    return (
        <div className="flex flex-col p-8">
            <header className="flex flex-col items-left">
                <h1 className="text-4xl font-bold text-left mb-4">WMATA Route Planner</h1>
            </header>
            <main className="flex flex-col justify-left items-left min-h-screen">
                <RoutePlannerClient />
            </main>
        </div>
    );
}