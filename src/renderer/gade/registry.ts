import MenuFrame from './MenuBar/MenuFrame';
import Dialog from './Dialog';

export const paths: any = {
    menu_frame: MenuFrame,
    dialog: Dialog,
};

export const registerPath = (path: string, element: any) => {
    paths[path] = element;
};
