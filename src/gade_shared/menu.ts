import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type MenuItem = {
    label?: string;
    shortcut?: string;
    divider?: boolean;
    dropdown?: MenuItem[];
    icon?: IconDefinition;
};

export type MenuData = {
    x: number;
    y: number;
    level: number;

    items: MenuItem[];
};
