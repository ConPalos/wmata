'use client'

import { Input } from "@/components/ui/input";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandList, CommandItem } from "@/components/ui/command";
import React, { useState } from "react";

type MapSearchProps = {
    placeholder?: string;
    className?: string;
    callback?: (value: [number, number] | null) => void;
}

export function MapSearch(props: MapSearchProps) {
    const { placeholder, className, callback } = props;
    // variable to control whether or not the dropdown is open
    let [open, setOpen] = useState(false);

    function HidingItem(props: React.ComponentProps<typeof CommandItem>) {
        return (
            <CommandItem
                {...props}
                onSelect = {() => {
                    // close the dropdown when a value is selected
                    setOpen(false)
                }}
                onClick = {(e) => {
                    // get the lat/lng from the item clicked
                    const latLng = e.currentTarget.getAttribute('data-latlng');
                    if(latLng && callback) {
                        const [lat, lng] = latLng.split(',').map(Number);
                        callback([lat, lng]);
                    }
                }}
            >
                {props.children}
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
                        {/* this gets populated with osm results */}
                        <HidingItem>
                            There is a value here!
                        </HidingItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </div>
    )
}