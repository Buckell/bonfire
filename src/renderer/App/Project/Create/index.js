import '../../../gade/fonts.css';
import { Background } from '../../../gade/Background';
import MenuBar from '../../../gade/MenuBar';
import { MenuIcon } from '../../../gade/MenuBar/MenuIcon';
import Icon from '../../assets/logo.svg';
import { WindowContent } from '../../component/WindowContent';
import Input from '../../../gade/Input';
import Typography from '../../../gade/Typography';
import Button from '../../../gade/Button';
import GADE from '../../../gade/gade';
import { useEffect, useState } from 'react';
import { Bonfire } from '../../bonfire';

export default function ProjectCreate() {
    document.title = 'Create Project';

    const [directories] = GADE.shared.useValue(
        'Bonfire.Directories',
        'PROJECT_CREATE'
    );

    const [name, setName] = useState('Unnamed Project');
    const [pathChanged, setPathChanged] = useState(false);
    const [path, setPath] = useState('');

    useEffect(() => {
        if (!pathChanged) {
            const sanitizedName = name
                .toLowerCase()
                .replaceAll(' ', '_')
                .replaceAll(/[^a-z0-9_]+/g, '');
            setPath(`${directories?.PROJECTS}/${sanitizedName}.bonfire`);
        }
    }, [name, directories, pathChanged]);

    return (
        <Background>
            <MenuBar>
                <MenuIcon src={Icon} />
            </MenuBar>

            <WindowContent
                style={{
                    padding: '20px',
                }}
            >
                <Typography margin="0" fontSize="16pt" marginBottom="40px">
                    New Project
                </Typography>
                <Input
                    label="Project Name"
                    style={{
                        marginBottom: '10px',
                    }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input
                    label="Path"
                    style={{
                        display: 'inline-block',
                        marginRight: '10px',
                        width: '400px'
                    }}
                    value={path}
                    onChange={(e) => {
                        setPathChanged(true);
                        setPath(e.target.value);
                    }}
                />
                <Button
                    onClick={() => {
                        GADE.saveFileDialog({
                            title: 'Project Path',
                            buttonLabel: 'Select',
                            defaultPath: path,
                            filters: [
                                {
                                    name: 'Bonfire Project',
                                    extensions: ['bonfire'],
                                }
                            ]
                        }).then((response) => {
                            if (!response.canceled) {
                                setPathChanged(true);
                                setPath(response.filePath);
                            }
                        });
                    }}
                >...</Button>

                <Button
                    style={{
                        marginTop: '30px',
                    }}
                    onClick={() => {
                        Bonfire.project.create({
                            name,
                            path,
                        });
                    }}
                >
                    Create &nbsp;'{name}'
                </Button>
            </WindowContent>
        </Background>
    );
}
