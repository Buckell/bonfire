import {Container} from "./Container";
import { useState } from 'react';
import Item from './Item';
import Divider from './Divider';
import GADE from '../../gade';

let transmitCallback = () => {};

GADE.receive("Menu.DataTransmit", (data) => transmitCallback(data));

export default function MenuFrame(props) {
    const [menuData, setMenuData] = useState({});

    transmitCallback = setMenuData;

    return (
        <Container>
            {menuData.items?.map((element) => {
                const dropdownEnabled = Boolean(element.dropdown) && element.dropdown.length > 0;

                return (
                    element.divider ?
                    <Divider /> :
                    <Item
                        label={element.label}
                        dropdown={dropdownEnabled}
                        icon={element.icon}
                        action={element.action}
                        onMouseEnter={(event) => {
                            const [x, y] = [
                                event.screenX - event.clientX + event.currentTarget.offsetLeft + event.currentTarget.offsetWidth,
                                event.screenY - event.clientY + event.currentTarget.offsetTop,
                            ];

                            if (dropdownEnabled) {
                                GADE.call("Menu.Test", {
                                    x, y,
                                    level: menuData.level + 1,
                                    items: element.dropdown
                                });
                            } else {
                                GADE.call("Menu.Close", menuData.level + 1);
                            }
                        }}
                    />
                );
            })}
        </Container>
    );
}
