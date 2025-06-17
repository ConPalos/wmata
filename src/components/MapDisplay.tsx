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

function fitMarkers(markers: { position: [number, number]; color?: string; title?: string }[]) {
    if(markers.length === 0) {
        return [[0, 0], 1]; // Default center and zoom if no markers
    }

    const latitudes = markers.map(marker => marker.position[0]);
    const longitudes = markers.map(marker => marker.position[1]);

    let minLat = Math.min(...latitudes);
    let maxLat = Math.max(...latitudes);
    let minLng = Math.min(...longitudes);
    let maxLng = Math.max(...longitudes);

    const latRange = maxLat - minLat;
    const lngRange = maxLng - minLng;

    // add 10% padding to the map
    minLat -= latRange * 0.1;
    maxLat += latRange * 0.1;
    minLng -= lngRange * 0.1;
    maxLng += lngRange * 0.1;

    const bounds: LatLngBounds = new L.LatLngBounds([minLat, minLng], [maxLat, maxLng]);

    const map = useMap();

    map.fitBounds(bounds);
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
                    style={props.style}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {props.markers?.map((marker, index) => (
                        <Marker position={marker.position} />
                    ))}
                </MapContainer>
            )}
        </div>
    );
}
