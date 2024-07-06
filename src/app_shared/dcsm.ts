export enum PortMode {
    Output,
    Input,
}

export type PortData = {
    portNumber: number;
    mode: PortMode;
    universe: number;
};

export type DeviceData = {
    port: string;
    name: string;
    manufacturer: string;

    ports: PortData[];
};

export type MainConfiguration = {
    framerate: number;
};
