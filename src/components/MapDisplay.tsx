'use client'

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MapContainerProps, useMap } from "react-leaflet";

// dynamically import MapContainer, Marker, and TileLayer to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });

interface MapDisplayProps extends MapContainerProps {
    center: [number, number];
    zoom: number;
    style?: React.CSSProperties;
    markers?: { position: [number, number]; color?: string; title?: string }[];
}

function FitMarkers({ markers }: { markers: { position: [number, number] }[] }) {
    const map = useMap();

    useEffect(() => {
        if(markers.length > 0) {
            const positions = markers.map(marker => marker.position);
            map.fitBounds(positions, { padding: [50, 50] });
        }
    }, [markers, map]);

    return null;
}

export function MapDisplay(props: MapDisplayProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                crossOrigin=""/>
            {isClient && (
                <MapContainer 
                    dragging={false}
                    center={props.center} 
                    zoom={props.zoom} 
                    zoomControl={false}
                    scrollWheelZoom={false}
                    boxZoom={false}
                    doubleClickZoom={false}
                    touchZoom={false}
                    keyboard={false}
                    style={props.style}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {props.markers?.map((marker, index) => (
                        <Marker position={marker.position} />
                    ))}
                    {props.markers && props.markers.length > 0 && (
                        <FitMarkers markers={props.markers} />
                    )}
                </MapContainer>
            )}
        </div>
    );
}
