'use client'

import React from "react";
import { MapContainer, MapContainerProps, Marker, TileLayer } from "react-leaflet";

interface MapDisplayProps extends MapContainerProps {
    center: [number, number];
    zoom: number;
    style?: React.CSSProperties;
    markers?: { position: [number, number]; color?: string; title?: string }[];
}

export default function MapDisplay(props: MapDisplayProps) {
    return (
        <div>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                crossOrigin=""/>
            <MapContainer 
                center={props.center} 
                zoom={props.zoom} 
                style={props.style}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {props.markers?.map((marker, index) => (
                    <Marker position={marker.position} />
                ))}
            </MapContainer>
        </div>
    );
}
