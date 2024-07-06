import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import GADE from './gade/gade';
import { paths } from './gade/registry';

import './gade/fonts.css';
import './gade/scroll.css';
import { MenuItem } from '../gade_shared/menu';
import store from './gade/store';

const path = window.location.pathname;

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

window.addEventListener('contextmenu', (event: MouseEvent) => {
    event.preventDefault();

    const [x, y] = GADE.getContextMenuPosition(event);

    let { target }: { target: any } = event;
    let elementContextMenu: MenuItem[] = [];

    while (target && target !== document.body) {
        if (target?.menu) {
            elementContextMenu = Array.from(target?.menu);
            break;
        }

        target = target?.parentElement;
    }

    if (elementContextMenu.length > 0) {
        elementContextMenu.push({
            dropdown: undefined,
            icon: undefined,
            label: undefined,
            shortcut: undefined,
            divider: true,
        });
    }

    const items = elementContextMenu.concat([
        {
            label: 'Copy',
        },
        {
            label: 'Paste',
        },
    ]);

    GADE.openMenu({
        x,
        y,
        level: 0,
        items,
    });
});

require('./App/register');

function Window() {
    const parts = path.substring(12).replaceAll('%3F', '?').split('?');
    const [queryPath, queryParameter]: string[] = [
        parts[0],
        decodeURI(parts.slice(1).join('?')).replaceAll('<P>', '.'),
    ];
    const Element: any = paths[queryPath] || App;

    return <Element param={queryParameter} />;
}

root.render(
    <React.StrictMode>
        <MemoryRouter>
            <Provider store={store}>
                <Routes>
                    <Route path="/">
                        <Route index element={<Window />} />
                    </Route>
                </Routes>
            </Provider>
        </MemoryRouter>
    </React.StrictMode>,
);
