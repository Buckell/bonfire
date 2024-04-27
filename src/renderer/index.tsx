import React, { DOMElement } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import GADE, { MenuItem } from './gade/gade';
import { paths } from './gade/registry';

import './gade/fonts.css';
import './gade/scroll.css';

const path = window.location.pathname;

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

window.addEventListener('contextmenu', (event: MouseEvent) => {
    event.preventDefault();

    const [x, y] = GADE.getContextMenuPosition(event);

    let { target } = event;
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
            shortcut: '',
            divider: false,
            icon: undefined,
            dropdown: [],
        },
        {
            label: 'Paste',
            shortcut: '',
            divider: false,
            icon: undefined,
            dropdown: [],
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
    const Element: any = paths[path.substring(12)] || App;

    return <Element />;
}

root.render(
    <React.StrictMode>
        <MemoryRouter>
            <Routes>
                <Route path="/">
                    <Route index element={<Window />} />
                </Route>
            </Routes>
        </MemoryRouter>
    </React.StrictMode>,
);
