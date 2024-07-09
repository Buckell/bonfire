import { useEffect, useState } from 'react';
import { Container } from './Container';
import Tabs from './Tabs';
import Frame from './Frame';
import GADE from '../../../../gade/gade';
import { tools } from '../../../tools';
import Tab from './Tabs/Tab';
import ContextMenu from '../../../../gade/ContextMenu';
import { Bonfire } from '../../../bonfire';
import clamp from '../../../../../app_shared/util/clamp';

export default function ToolWindow(props) {
    const { style, id } = props;

    const [tabPosition] = Bonfire.useUIConfigItem('toolWindowTabPosition');

    const [tabLayout, setTabLayout] = Bonfire.project.useStoreValue(
        'config',
        `ToolWindow.Layout[${id}]`,
        `TOOL_WINDOW_LAYOUT_${id}`,
    );

    const [currentTab, setCurrentTab] = Bonfire.project.useStoreValue(
        'config',
        `ToolWindow.CurrentTab[${id}]`,
        `TOOL_WINDOW_CURRENT_${id}`,
    );

    const [tabs, setTabs] = useState([]);

    const openTab = (itemId) => {
        setTabLayout([...tabLayout.filter((tab) => tab !== itemId), itemId]);
        setCurrentTab(itemId);
    };

    const closeTab = (itemId) => {
        setTabLayout((oldLayout) =>
            oldLayout.filter((tabId, index) => {
                if (tabId === itemId) {
                    setCurrentTab(tabLayout[Math.max(index - 1, 0)]);
                    return false;
                }

                return true;
            }),
        );
    };

    useEffect(() => {
        setTabs((currentTabs) =>
            tabLayout?.map((itemId) => {
                const currentTab = currentTabs?.find(
                    (tab) => tab.id === itemId,
                );

                if (currentTab !== undefined) {
                    return currentTab;
                }

                const item = tools[itemId];
                const WindowElement = item.window;

                return {
                    id: itemId,
                    item,
                    window: WindowElement && <WindowElement />,
                };
            }),
        );
    }, [tabLayout]);

    GADE.hooks.add('Menu.Action', `ToolWindow.${id}`, (action) => {
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
            {tabPosition === 'bottom' && (
                <Frame>
                    {tabs?.find((tab) => tab.id === currentTab)?.window}
                </Frame>
            )}
            <Tabs id={id}>
                {tabs?.map((tab, index) => (
                    <ContextMenu
                        menu={[
                            {
                                label: 'Close Tab',
                                action: `ToolWindow.${id}.Close.${tab.id}`,
                            },
                        ]}
                    >
                        <Tab
                            key={`${id}${tab.id}`}
                            icon={tab.item.icon}
                            title={tab.item.title}
                            active={tab.id === currentTab}
                            onClick={() => setCurrentTab(tab.id)}
                        />
                    </ContextMenu>
                ))}
            </Tabs>
            {tabPosition === 'top' && (
                <Frame>
                    {tabs?.find((tab) => tab.id === currentTab)?.window}
                </Frame>
            )}
        </Container>
    );
}
