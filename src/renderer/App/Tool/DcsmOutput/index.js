import { useEffect, useState } from 'react';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import List from '../../../gade/List';
import ListItem from '../../../gade/List/ListItem';
import Input from '../../../gade/Input';
import { PropertyPanel } from './PropertyPanel';
import { Container } from './Container';
import Typography from '../../../gade/Typography';
import { PatchesPanel } from './PatchesPanel';
import IconButton from '../../../gade/IconButton';
import { EditPanel } from './EditPanel';
import Dropdown from '../../../gade/Dropdown';
import DropdownItem from '../../../gade/Dropdown/DropdownItem';
import { Bonfire } from '../../bonfire';
import Button from '../../../gade/Button';
import DeviceContainer from './DeviceContainer';
import Tooltip from '../../../gade/Tooltip';

export default function DcsmOutput() {
    const [devices, setDevices] = useState({});
    const [config, setConfig] = useState({});
    const [selection, setSelection] = useState('');

    const [masterFramerate, setMasterFramerate] = useState('');

    const [deviceFramerate, setDeviceFramerate] = useState('');
    const [devicePortUniverses, setDevicePortUniverses] = useState({});

    const getDevices = () => {
        Bonfire.DCSM.getDevices().then(setDevices);
    };

    const refreshDevices = () => {
        Bonfire.DCSM.refreshDevices().then(getDevices);
    };

    const refreshConfig = () => {
        Bonfire.DCSM.getConfig().then(setConfig);
    };

    const saveConfig = () => {
        Bonfire.DCSM.setConfig({
            framerate: parseInt(masterFramerate, 10),
        }).then(refreshConfig);
    };

    useEffect(getDevices, []);
    useEffect(refreshConfig, []);

    useEffect(() => {
        setMasterFramerate(`${config.framerate}`);
    }, [config, setMasterFramerate]);

    useEffect(() => {
        const newDevicePortUniverses = {};

        devices[selection]?.ports?.forEach?.((port, index) => {
            newDevicePortUniverses[index] = `${port.universe}`;
        });

        setDevicePortUniverses(newDevicePortUniverses);
    }, [devices, selection]);

    return (
        <Container>
            <PatchesPanel>
                <List
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        width: '200px',
                    }}
                >
                    <ListItem>
                        <Typography
                            textAlign="center"
                            fontSize="9.5pt"
                            fontWeight="500"
                            color="#dddddd"
                            marginTop="20px"
                        >
                            DEVICES
                        </Typography>
                    </ListItem>
                    {Object.entries(devices).map(([port, device]) => (
                        <ListItem>
                            <DeviceContainer
                                key={port}
                                active={selection === port}
                                onClick={() => setSelection(port)}
                                port={device.port}
                                name={device.name}
                                manufacturer={device.manufacturer}
                            />
                        </ListItem>
                    ))}
                    <ListItem
                        style={{
                            textAlign: 'center',
                            marginTop: '20px',
                        }}
                    >
                        <IconButton icon={faRefresh} onClick={refreshDevices} />
                    </ListItem>
                </List>

                <EditPanel>
                    {selection !== '' && (
                        <>
                            <Typography
                                fontSize="16pt"
                                margin="0 0 40px 0"
                                fontWeight="200"
                            >
                                Device Parameters
                            </Typography>
                            <Input
                                label="Output Framerate"
                                style={{
                                    marginBottom: '30px',
                                }}
                            />
                            {devices[selection]?.ports?.map?.((port, index) => (
                                <Tooltip
                                    key={port.portNumber}
                                    label="The universe to output to this port. Leave blank to ignore."
                                    pos={Tooltip.BOTTOM_RUNRIGHT}
                                >
                                    <Input
                                        label={`Port ${port.portNumber} - Output Universe`}
                                        style={{
                                            marginBottom: '30px',
                                        }}
                                        value={devicePortUniverses[index]}
                                        onChange={(e) => {
                                            setDevicePortUniverses(
                                                (oldDevicePortUniverses) => {
                                                    const newDevicePortUniverses =
                                                        {
                                                            ...oldDevicePortUniverses,
                                                        };

                                                    newDevicePortUniverses[
                                                        index
                                                    ] = e.target.value;

                                                    return newDevicePortUniverses;
                                                },
                                            );
                                        }}
                                    />
                                </Tooltip>
                            ))}
                            <Button
                                style={{
                                    marginRight: '10px',
                                }}
                            >
                                Save
                            </Button>
                        </>
                    )}
                </EditPanel>
            </PatchesPanel>
            <PropertyPanel>
                <Typography marginTop="15px" marginBottom="50px">
                    DCSM Settings
                </Typography>
                <Tooltip
                    label="The rate at which universe data is transmitted to connected devices."
                    pos={Tooltip.BOTTOM_RUNRIGHT}
                >
                    <Input
                        label="Transmit Framerate"
                        style={{
                            width: '150px',
                            marginBottom: '20px',
                        }}
                        value={masterFramerate}
                        onChange={(e) => setMasterFramerate(e.target.value)}
                    />
                </Tooltip>
                <Button onClick={saveConfig}>Save</Button>
            </PropertyPanel>
        </Container>
    );
}
