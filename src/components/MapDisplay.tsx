'use client'

import React from "react";
import { MapContainer, MapContainerProps, TileLayer } from "react-leaflet";

export default function MapDisplay(props: MapContainerProps) {
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
            </MapContainer>
        </div>
    );
}
