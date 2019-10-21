export interface StepManeuver {
    location: Array<[number, number]>;
    bearing_before: string; // The clockwise angle from true north to the direction of travel immediately before the maneuver. Range 0-359.
    bearing_after: string; // The clockwise angle from true north to the direction of travel immediately after the maneuver. Range 0-359.
    type?: string;
    modifier?: string; // direction modifier for turn type
    exit: number; // property exists for the roundabout / rotary
}
