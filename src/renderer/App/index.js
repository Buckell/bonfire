import { Background } from '../gade/Background';
import MenuBar from '../gade/MenuBar';
import { MenuIcon } from '../gade/MenuBar/MenuIcon';

import Icon from './assets/logo.svg';
import '../gade/fonts.css';
import Menu from '../gade/MenuBar/Menu';
import MenuItem from '../gade/MenuBar/Menu/MenuItem';
import Divider from '../gade/MenuBar/Menu/Divider';
import { faAdd, faCog, faFolder, faSave } from '@fortawesome/free-solid-svg-icons';

export default function App() {
    document.title = 'DCSM Gateway';

    return (
        <Background>
            <MenuBar>
                <MenuIcon src={Icon} />

                <Menu title="File">
                    <MenuItem title="New Project" icon={faAdd} action={() => {
                        console.log("New Project!");
                    }} />
                    <MenuItem title="Open..." icon={faFolder} action={() => {
                        console.log("Open!");
                    }} />
                    <MenuItem title="Save As..." icon={faSave} />
                    <Menu title="Recent Projects">
                        <MenuItem title="Unnamed Show 1 (unnamed1.bonfire)" />
                        <MenuItem title="Rumors 2023 (rumors2023.bonfire)" />
                        <MenuItem title="Curtains 2022 (curtains2022.bonfire)" />
                    </Menu>
                    <Divider />
                    <MenuItem title="Settings" icon={faCog} />
                </Menu>

                <Menu title="Edit">
                    <Menu title="Recent Projects">
                        <Menu title="Unnamed Show 1 (unnamed1.bonfire)">
                            <MenuItem title="Unnamed Show 1 (unnamed1.bonfire)" />
                            <MenuItem title="Rumors 2023 (rumors2023.bonfire)" />
                            <MenuItem title="Curtains 2022 (curtains2022.bonfire)" />
                        </Menu>
                    </Menu>
                </Menu>

                <Menu title="View">

                </Menu>
            </MenuBar>

        </Background>
    );
}
