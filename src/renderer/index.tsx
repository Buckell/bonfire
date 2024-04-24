import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import App from './App';
import MenuFrame from './gade/MenuBar/MenuFrame';

const path = window.location.pathname;

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <MemoryRouter>
            <Routes>
                <Route path="/">
                    <Route
                        index
                        element={
                            path.startsWith("/index.html/menu_frame") ?
                            <MenuFrame /> :
                            <App />
                        }
                    />
                </Route>
            </Routes>
        </MemoryRouter>
    </React.StrictMode>,
);
