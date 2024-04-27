import { useState } from 'react';
import { Container } from './Container';
import Tabs from './Tabs';
import Frame from './Frame';
import GADE from '../../../../gade/gade';
import { tools } from '../../../tools';
import Tab from './Tabs/Tab';
import ContextMenu from '../../../../gade/ContextMenu';

export default function ToolWindow(props) {
    const { style, id } = props;

    const [tabs, setTabs] = useState([]);
    const [currentTab, setCurrentTab] = useState(-1);

    const openTab = (itemId) => {
        const item = tools[itemId];
        const WindowElement = item.window;

        setCurrentTab(tabs.length);
        setTabs((currentTabs) => [
            ...currentTabs,
            {
                id: itemId,
                item,
                window: WindowElement && <WindowElement />,
            },
        ]);
    };

    const closeTab = (itemId) => {
        setTabs((currentTabs) =>
            currentTabs.filter((tab, i) => {
                if (tab.id !== itemId) {
                    return true;
                }

                setCurrentTab(i + 1 === currentTabs.length ? 0 : i);
                return false;
            }),
        );
    };

    GADE.addHook('Menu.Action', `ToolWindow.${id}`, (action) => {
        const openStart = `ToolWindow.${id}.Open.`;
        const closeStart = `ToolWindow.${id}.Close.`;

        if (action.startsWith(openStart)) {
            const itemId = action.substring(openStart.length);

            openTab(itemId);

            GADE.closeMenu(0);
        } else if (action.startsWith(closeStart)) {
            const itemId = action.substring(closeStart.length);

            closeTab(itemId);

            GADE.closeMenu(0);
        }
    });

    return (
        <Container style={style}>
            <Tabs id={id}>
                {tabs.map((tab, index) => (
                    <ContextMenu
                        menu={[
                            {
                                label: 'Close Tab',
                                action: `ToolWindow.${id}.Close.${tab.id}`,
                            },
                        ]}
                    >
                        <Tab
                            // eslint-disable-next-line react/no-array-index-key
                            key={`${tab.id}${index}`}
                            icon={tab.item.icon}
                            title={tab.item.title}
                            active={index === currentTab}
                            onClick={() => setCurrentTab(index)}
                        />
                    </ContextMenu>
                ))}
            </Tabs>
            <Frame>{tabs[currentTab]?.window}</Frame>
        </Container>
    );
}
