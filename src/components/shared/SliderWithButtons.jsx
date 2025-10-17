import { Button } from "@/components/ui/button.jsx";
import { Slider } from "@/components/ui/slider";
import { Plus, Minus } from "lucide-react";

export default function SliderWithButtons({
                                              value,
                                              onChange,
                                              min,
                                              max,
                                              step = 1,
                                              disabled,
                                          }) {
    return (
        <div className="flex items-center gap-2">
            <Button
                size="icon"
                aria-label="decrease"
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
                aria-label="increase"
                className="bg-muted hover:bg-primary/20 text-foreground rounded-full w-8 h-8 flex items-center justify-center shadow-sm transition-transform duration-150 ease-in-out hover:scale-105"
                disabled={disabled || value >= max}
                onClick={() => onChange(value + 1)}
            >
                <Plus className="w-4 h-4" />
            </Button>
        </div>
    );
}
