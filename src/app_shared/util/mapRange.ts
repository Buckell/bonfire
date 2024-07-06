import clamp from './clamp';

export const mapRange = (
    [inMin, inMax]: [number, number],
    [outMin, outMax]: [number, number],
    current: number,
): number => {
    const mapped: number =
        ((current - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    return clamp(mapped, outMin, outMax);
};
