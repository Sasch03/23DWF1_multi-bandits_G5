import { Button } from "@/components/ui/button.jsx";
import { Slider } from "@/components/ui/slider";
import { Plus, Minus } from "lucide-react";

/**
 * SliderWithButtons
 *
 * A UI component combining a slider and two buttons to increase or decrease the value.
 *
 * @param {Object} props - Component properties.
 * @param {number} props.value - The current value of the slider.
 * @param {function(number): void} props.onChange - Callback function triggered when the value changes.
 * @param {number} props.min - Minimum allowed value.
 * @param {number} props.max - Maximum allowed value.
 * @param {number} [props.step=1] - Step size for slider and buttons.
 * @param {boolean} [props.disabled=false] - Disables slider and buttons when true.
 * @param {string} props.label - Label for accessibility (aria-label).
 *
 * @returns {JSX.Element} The rendered slider and button combination.
 */


export default function SliderWithButtons({
                                              value,
                                              onChange,
                                              min,
                                              max,
                                              step = 1,
                                              disabled,
                                              label
                                          }) {
    return (
        <div className="flex items-center gap-2">
            <Button
                size="icon"
                aria-label={`decrease-${label}`}
                className="bg-muted hover:bg-primary/20 text-foreground rounded-full w-8 h-8 flex items-center justify-center shadow-sm transition-transform duration-150 ease-in-out hover:scale-105"
                disabled={disabled || value <= min}
                onClick={() => onChange(value - 1)}
            >
                <Minus className="w-4 h-4" />
            </Button>

            <Slider
                value={[value]}
                onValueChange={(val) => onChange(val[0])}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                className={`flex-1 ${disabled ? "opacity-50 pointer-events-none" : ""}`}
            />

            <Button
                size="icon"
                aria-label={`increase-${label}`}
                className="bg-muted hover:bg-primary/20 text-foreground rounded-full w-8 h-8 flex items-center justify-center shadow-sm transition-transform duration-150 ease-in-out hover:scale-105"
                disabled={disabled || value >= max}
                onClick={() => onChange(value + 1)}
            >
                <Plus className="w-4 h-4" />
            </Button>
        </div>
    );
}
