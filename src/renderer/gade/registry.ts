import MenuFrame from './MenuBar/MenuFrame';

export const paths: any = {
    'menu_frame': MenuFrame,
};

export const registerPath = (path: string, element: any) => {
    paths[path] = element;
};
