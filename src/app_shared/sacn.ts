export type RouteData = {
    id: number;
    sourceUniverse: number;
    destinationUniverse: number;
    destination: string;
    priority: number;
};

export type MainConfiguration = {
    framerate: number;
};

export const MULTICAST = 'multicast';
