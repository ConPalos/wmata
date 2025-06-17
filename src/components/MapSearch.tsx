'use client'

import { Command, CommandInput, CommandEmpty, CommandGroup, CommandList, CommandItem } from "@/components/ui/command";
import React, { useState } from "react";

async function searchPlaces(query: string): Promise<any[]> {
    // call the internal wmata api and ask for a list of stations that look like the query
    const response = await fetch(`/api/wmata/stations?query=${encodeURIComponent(query)}`)

    if(!response.ok) {
        throw new Error("Failed to fetch places");
    }

    const data = await response.json();

    // map the data to a format the command component can use
    return data.map((item: any) => ({
        key: item.id,
        lat: item.lat,
        lon: item.lon,
        label: item.name || item.label || "Unknown Place"
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
    let [selectedLabel, setSelectedLabel] = useState("");

    function HidingItem(props: React.ComponentProps<typeof CommandItem> & { lat: number, lon: number, label: string }) {
        const { lat, lon, label, ...rest } = props;
        return (
            <CommandItem
                {...rest}
                onSelect={() => {
                    setOpen(false);
                    setSelectedLabel(label);
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
                    value={selectedLabel}
                    onValueChange = {(value: string) => {
                        setSelectedLabel(value);
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
                                label={result.label}
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