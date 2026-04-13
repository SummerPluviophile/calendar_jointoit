import { DEFAULT_VALUES } from "../constants/textConstants";

interface ColorPickerProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

/**
 * Color picker component for selecting event color
 */
export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const colorValue = value || DEFAULT_VALUES.eventColor;

  return (
    <div className="flex flex-col w-full">
      <label htmlFor="eventColor" className="text-label">
        color
      </label>
      <div className="flex items-center gap-3 mt-1">
        <input
          type="color"
          id="eventColor"
          name="eventColor"
          value={colorValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-6 cursor-pointer border rounded"
        />
        <span className="text-secondary">{colorValue}</span>
      </div>
    </div>
  );
}
