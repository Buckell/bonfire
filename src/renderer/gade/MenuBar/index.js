import { useEffect, useState } from 'react';
import { Container } from './Container';
import Menu from './Menu';
import GADE, { MenuPosition } from '../gade';

const actions = {};

GADE.receive('Menu.Action', (actionId) => {
    const action = actions[actionId];

    if (action) {
        action();
    }
});

let closeCallback = () => {};

GADE.receive('Menu.Blur', () => closeCallback());

export default function MenuBar(props) {
    const [open, setOpen] = useState(false);
    const [block, setBlock] = useState(false);

    closeCallback = () => setOpen(false);

    const openMenu = (event, items) => {
        if (!open) {
            setOpen(true);
        }

        const [x, y] = GADE.getElementMenuPosition(event, MenuPosition.Bottom);

        GADE.openMenu({
            x,
            y,
            items,
            level: 0,
        });
    };

    const onClick = () => {
        if (block) {
            setBlock(false);
            return;
        }

        if (open) {
            setOpen(false);
        }
    };

    useEffect(() => {
        window.addEventListener('click', onClick);

        return () => window.removeEventListener('click', onClick);
    }, [open, block, onClick]);

    const findItems = (id, children) => {
        children = children || [];
        children = Array.isArray(children) ? children : [children];

        return children.map((child) => {
            const actionId = `${id}.${child.props.title}`;

            const value = {
                label: child.props.title,
                shortcut: child.props.shortcut,
                icon: child.props.icon,
                divider: false,
                dropdown: [],
            };

            if (child.props.action) {
                value.action = actionId;
                actions[actionId] = child.props.action;
            }

            switch (child.type.name) {
                case 'MenuItem':
                    break;
                case 'Menu':
                    value.dropdown = findItems(actionId, child.props.children);
                    break;
                case 'Divider':
                    value.divider = true;
                    break;
                default:
                    break;
            }

            return value;
        });
    };

    const children = Array.isArray(props.children)
        ? props.children
        : [props.children];

    return (
        <Container onClickCapture={onClick}>
            {children.map((menu) => {
                const items = findItems(menu.props.title, menu.props.children);

                if (menu.type.name === 'Menu') {
                    return (
                        <Menu
                            title={menu.props.title}
                            onClick={(e) => {
                                setBlock(true);
                                openMenu(e, items);
                            }}
                            onMouseEnter={(e) => {
                                if (open) {
                                    openMenu(e, items);
                                }
                            }}
                            key={menu.props.title}
                        >
                            {menu.props.children}
                        </Menu>
                    );
                }

                return menu;
            })}
        </Container>
    );
}
