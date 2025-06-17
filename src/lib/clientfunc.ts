'use client'

import { useState } from "react";

export function getState<T>(initialValue: T): [T, (value: T) => void] {
    const [state, setState] = useState<T>(initialValue);
    
    const updateState = (value: T) => {
        setState(value);
    };

    return [state, updateState];
}