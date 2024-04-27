import { Background } from '../../gade/Background';
import MenuBar from '../../gade/MenuBar';
import { MenuIcon } from '../../gade/MenuBar/MenuIcon';

import Icon from '../assets/logo.svg';
import '../../gade/fonts.css';

export default function TestWindow() {
    document.title = 'DCSM Gateway';

    return (
        <Background>
            <MenuBar>
                <MenuIcon src={Icon} />
            </MenuBar>
        </Background>
    );
}
