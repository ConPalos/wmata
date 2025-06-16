import { MapSearch } from "@/components/MapSearch";
import MapDisplay from "@/components/MapDisplay";
import { useState } from "react";
import { MapPin } from "lucide-react";

export default function PlanRoute() {
    // set markers on the map if they exist
    const [originCoords, setOriginCoords] = useState<[number, number] | null>(null);
    const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null);

    return (
        <div className="flex flex-col p-8">
            <header className="flex flex-col items-left">
                <h1 className="text-4xl font-bold text-left mb-4">WMATA Route Planner</h1>
            </header>
            <main className="flex flex-col justify-left items-left min-h-screen">
                <p className="text-lg">This is the route planner page. Here you can plan your routes using WMATA's services.</p>
                <p className="text-md">It is also currently under construction. Come back later!</p>
                <div className="grid grid-cols-2 grid-rows-2 justify-left mt-4">
                    {/* The origin and destination inputs go here - they will link to the WMATA API */}
                    <MapSearch placeholder="Enter your origin here..." className="mb-2" />
                    <MapSearch placeholder="Enter your destination here..." className="mb-2" />
                    <div className="col-span-2">
                        <p className="text-sm text-gray-500">
                            Note: The map search feature is currently under construction and will be available soon.
                        </p>
                    </div>
                    <div className="col-span-2 mt-4">
                        <MapDisplay 
                            center={[38.9072, -77.0369]} 
                            zoom={12} 
                            style={{ height: "400px", width: "100%" }} 
                        >
                            {/* render the markers */}
                            {originCoords && (
                                <MapPin 
                                    position={originCoords} 
                                    color="blue" 
                                    title="Origin" 
                                />
                            )}
                            {destinationCoords && (
                                <MapPin 
                                    position={destinationCoords} 
                                    color="blue" 
                                    title="Origin" 
                                />
                            )}
                        </MapDisplay>
                    </div>
                </div>
            </main>
        </div>
    )
}