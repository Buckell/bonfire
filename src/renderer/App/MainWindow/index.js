import {
    faAdd,
    faCog,
    faFolder,
    faSave,
} from '@fortawesome/free-solid-svg-icons';

import { Background } from '../../gade/Background';
import MenuBar from '../../gade/MenuBar';
import { MenuIcon } from '../../gade/MenuBar/MenuIcon';

import Icon from '../assets/logo.svg';
import '../../gade/fonts.css';
import Menu from '../../gade/MenuBar/Menu';
import MenuItem from '../../gade/MenuBar/Menu/MenuItem';
import Divider from '../../gade/MenuBar/Menu/Divider';
import GADE from '../../gade/gade';
import TopBar from './TopBar';
import LeftBar from './LeftBar';
import RightBar from './RightBar';
import WindowMatrix from './WindowMatrix';
import CommandBar from './CommandBar';
import { tools } from '../tools';

export default function MainWindow() {
    document.title = 'DCSM Gateway';

    return (
        <Background>
            <MenuBar>
                <MenuIcon src={Icon} />

                <Menu title="File">
                    <MenuItem
                        title="New Project"
                        icon={faAdd}
                        action={() => {
                            console.log('New Project!');
                        }}
                    />
                    <MenuItem
                        title="Open..."
                        icon={faFolder}
                        action={() => {
                            console.log('Open!');
                        }}
                    />
                    <MenuItem title="Save As..." icon={faSave} />
                    <Menu title="Recent Projects">
                        <MenuItem title="Unnamed Show 1 (unnamed1.bonfire)" />
                        <MenuItem title="Rumors 2023 (rumors2023.bonfire)" />
                        <MenuItem title="Curtains 2022 (curtains2022.bonfire)" />
                    </Menu>
                    <Divider />
                    <MenuItem title="Import Settings From..." />
                    <Divider />
                    <MenuItem title="Settings" icon={faCog} />
                    <MenuItem
                        title="Test"
                        action={() => {
                            GADE.openWindow('test');
                        }}
                    />
                </Menu>

                <Menu title="Edit">
                    <Menu title="Recent Projects">
                        <Menu title="Unnamed Show 1 (unnamed1.bonfire)">
                            <MenuItem title="Unnamed Show 1 (unnamed1.bonfire)" />
                            <MenuItem title="Rumors 2023 (rumors2023.bonfire)" />
                            <MenuItem action={() => {
                                console.log('dsfdsaf!');
                            }} title="Curtains 2022 (curtains2022.bonfire)" />
                        </Menu>
                    </Menu>
                </Menu>

                <Menu title="View">
                    <Menu title="Open Window">
                        {Object.values(tools).map((tool) => (
                            <MenuItem title={tool.title} icon={tool.icon} />
                        ))}
                    </Menu>
                </Menu>
            </MenuBar>

            <TopBar></TopBar>
            <LeftBar></LeftBar>
            <RightBar></RightBar>
            <CommandBar></CommandBar>

            <WindowMatrix></WindowMatrix>
        </Background>
    );
}
