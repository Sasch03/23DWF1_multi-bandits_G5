import React from "react";
import { Button } from "@/components/ui/button.jsx";

/**
 * Wiederverwendbarer Counter im Stil von BanditConfig.
 * Plus/Minus Buttons links/rechts, Zahl in der Mitte.
 *
 * @component
 * @param {Object} props
 * @param {number} props.value - aktueller Wert
 * @param {Function} props.onChange - Callback, wenn Wert geändert wird
 * @param {number} [props.min=0] - Minimalwert
 * @param {number} [props.max=100] - Maximalwert
 */
export default function Counter({ value, onChange, min = 0, max = 100 }) {
    return (
        <div className="flex items-center gap-2">
            <Button onClick={() => onChange(Math.max(min, value - 1))}>-</Button>
            <div className="flex-1 text-center">{value}</div>
            <Button onClick={() => onChange(Math.min(max, value + 1))}>+</Button>
        </div>
    );
}
