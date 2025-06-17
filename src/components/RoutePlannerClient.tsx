'use client';

import { useState } from "react";
import { MapSearch } from "@/components/MapSearch";
import { MapDisplay } from "@/components/MapDisplay";

type Marker = {
    position: [number, number];
    color?: string;
    title?: string;
};

export default function RoutePlannerClient() {
    const [originCoords, setOriginCoords] = useState<[number, number] | null>(null);
    const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null);

    const markers: Marker[] = [];
    originCoords && markers.push({ position: originCoords, color: "blue", title: "Origin" });
    destinationCoords && markers.push({ position: destinationCoords, color: "red", title: "Destination" });

    return (
        <div className="relative grid grid-cols-2 grid-rows-8 justify-left gap-4">
            <MapSearch placeholder="Enter your origin here..." className="relative mb-2 z-10" callback={setOriginCoords} />
            <MapSearch placeholder="Enter your destination here..." className="relative mb-2 z-10" callback={setDestinationCoords} />
            <div className="col-span-2 row-span-7 mt-4 z-5">
                <MapDisplay
                    center={[38.9072, -77.0369]} 
                    zoom={12} 
                    style={{ height: "400px", width: "100%" }} 
                    markers={markers}
                />
            </div>
        </div>
    );
}
