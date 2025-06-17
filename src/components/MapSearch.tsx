'use client'

import { Input } from "@/components/ui/input";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandList, CommandItem } from "@/components/ui/command";
import React, { useState } from "react";

// call the nominatim api to search for places
async function searchPlaces(query: string): Promise<any[]> {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
    if (!response.ok) {
        throw new Error("Failed to fetch places");
    }
    const data = await response.json();
    return data.map((item: any) => ({
        key: item.place_id,
        label: item.display_name,
        lat: item.lat,
        lon: item.lon,
    }));
}

type MapSearchProps = {
    placeholder?: string;
    className?: string;
    callback?: (value: [number, number] | null) => void;
}

export function MapSearch(props: MapSearchProps) {
    const { placeholder, className, callback } = props;
    // variable to control whether or not the dropdown is open
    let [open, setOpen] = useState(false);
    let [results, setResults] = useState<any[]>([]);

    function HidingItem(props: React.ComponentProps<typeof CommandItem> & { lat: number, lon: number }) {
        const { lat, lon, ...rest } = props;
        return (
            <CommandItem
                {...rest}
                onSelect = {(e) => {
                    // close the dropdown when a value is selected
                    setOpen(false)
                    // get the lat/lng from the item clicked
                    if(lat && lon && callback) {
                        callback([lat, lon].map(Number) as [number, number]);
                    }
                }}
            >
                {rest.children}
            </CommandItem>
        )
    }

    return (
        <div className={(className + " " || "") + "overflow-visible p-8 items-left"}>
            <Command className="w-full absolute">
                <CommandInput
                    placeholder={placeholder || ''}
                    className="mb-4"
                    onValueChange = {(value: string) => {
                        // open the dropdown if text is in here
                        if(value.trim().length > 0) {
                            setOpen(true);
                            // search for places
                            searchPlaces(value).then((data) => {
                                setResults(data);
                            }).catch(() => {
                                setResults([]);
                            })
                        }
                        else {
                            setOpen(false);
                        }
                    }}
                    onClick = {(e) => {
                        // if the input is not empty, then open up the dropdown again
                        if(e.currentTarget.value.trim().length > 0) {
                            setOpen(true);
                        }
                    }}
                />
                {/* <CommandList className={open ? "block" : "hidden"}> */}
                <CommandList hidden={!open}>
                    <CommandEmpty>No places found</CommandEmpty>
                    <CommandGroup>
                        {/* each result becomes an item here */}
                        {results.map(result => (
                            <HidingItem
                                key={result.key}
                                lat={result.lat}
                                lon={result.lon}
                            >
                                {result.label}
                            </HidingItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </Command>
        </div>
    )
}