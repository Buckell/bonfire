import { faQuestionCircle, faWarning } from '@fortawesome/free-solid-svg-icons';

export enum DialogIcon {
    Info,
    Warning,
}

export const DialogIcons = [faQuestionCircle, faWarning];

export type DialogOption = {
    label: string;
    action: string;
};

export type DialogData = {
    title: string;
    description: string;
    icon?: DialogIcon;
    options: DialogOption[];
    size?: number[];
};
