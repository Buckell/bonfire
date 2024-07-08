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
import { DialogIcon } from '../../../gade_shared/dialog';
import { Bonfire } from '../bonfire';

export default function MainWindow() {
    document.title = 'Lightbox';

    const [projects] = GADE.shared.useValue(
        'Bonfire.Project.Projects',
        'MAIN_WINDOW',
    );

    const recentAccess = projects?.sort((p1, p2) => {
        return p2.latestAccess - p1.latestAccess;
    });

    return (
        <Background>
            <MenuBar>
                <MenuIcon src={Icon} />

                <Menu title="File">
                    <MenuItem
                        title="New Project"
                        icon={faAdd}
                        action={Bonfire.project.promptCreation}
                    />
                    <MenuItem
                        title="Open..."
                        icon={faFolder}
                        action={() => {
                            GADE.openFileDialog({
                                title: 'Open Project',
                                properties: ['openFile'],
                                filters: [
                                    {
                                        name: 'Bonfire Project',
                                        extensions: ['bonfire'],
                                    },
                                ],
                            }).then((response) => {
                                if (
                                    !response.canceled &&
                                    response.filePaths.length > 0
                                ) {
                                    Bonfire.project.open(response.filePaths[0]);
                                }
                            });
                        }}
                    />
                    <MenuItem
                        title="Save"
                        icon={faSave}
                        action={() => {
                            Bonfire.project.save();
                        }}
                    />
                    <Menu title="Recent Projects">
                        {recentAccess?.map((project) => (
                            <MenuItem
                                key={project.path}
                                title={`${project.name} (${project.path})`}
                                action={() => {
                                    GADE.openDialog({
                                        title: 'Confirm Open',
                                        description: `Are you sure you want to open '${project.name}'?`,
                                        options: [
                                            {
                                                label: 'Open',
                                                action: 'open',
                                            },
                                            {
                                                label: 'Cancel',
                                                action: 'close',
                                            },
                                        ],
                                    }, (id, action) => {
                                        GADE.closeDialog(id);

                                        if (action === 'open') {
                                            Bonfire.project.open(project.path);
                                        }
                                    });
                                }}
                            />
                        ))}
                    </Menu>
                    <Divider />
                    <MenuItem title="Import Settings From..." />
                    <Divider />
                    <MenuItem title="Settings" icon={faCog} />
                    <Divider />
                    <MenuItem
                        title="Exit"
                        action={() => {
                            GADE.openDialog(
                                {
                                    title: 'Confirm Exit',
                                    description:
                                        'Are you sure you want to exit?',
                                    icon: DialogIcon.Info,
                                    options: [
                                        {
                                            label: 'Exit',
                                            action: 'exit',
                                        },
                                        {
                                            label: 'Cancel',
                                            action: 'close',
                                        },
                                    ],
                                },
                                (id, action) => {
                                    if (action === 'close') {
                                        GADE.closeDialog(id);
                                    }
                                },
                            );
                        }}
                    />
                </Menu>

                <Menu title="Edit">
                    <Menu title="Recent Projects">
                        <Menu title="Unnamed Show 1 (unnamed1.bonfire)">
                            <MenuItem title="Unnamed Show 1 (unnamed1.bonfire)" />
                            <MenuItem title="Rumors 2023 (rumors2023.bonfire)" />
                            <MenuItem
                                action={() => {
                                    console.log('dsfdsaf!');
                                }}
                                title="Curtains 2022 (curtains2022.bonfire)"
                            />
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

            <TopBar />
            <LeftBar />
            <RightBar />
            <CommandBar />

            <WindowMatrix />
        </Background>
    );
}
