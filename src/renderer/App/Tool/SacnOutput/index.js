import { useEffect, useState } from 'react';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import List from '../../../gade/List';
import ListItem from '../../../gade/List/ListItem';
import Input from '../../../gade/Input';
import { PropertyPanel } from './PropertyPanel';
import { Container } from './Container';
import Typography from '../../../gade/Typography';
import { PatchesPanel } from './PatchesPanel';
import PatchContainer from './PatchContainer';
import IconButton from '../../../gade/IconButton';
import { EditPanel } from './EditPanel';
import Dropdown from '../../../gade/Dropdown';
import DropdownItem from '../../../gade/Dropdown/DropdownItem';
import { Bonfire } from '../../bonfire';
import Button from '../../../gade/Button';
import { MULTICAST } from '../../../../app_shared/sacn';

export default function SacnOutput() {
    const [routes, setRoutes] = useState([]);
    const [selection, setSelection] = useState(-2);

    const [framerate, setFramerate] = useState('');

    const [sourceUniverse, setSourceUniverse] = useState('');
    const [destinationUniverse, setDestinationUniverse] = useState('');
    const [outputType, setOutputType] = useState('Multicast');
    const [unicastDestination, setUnicastDestination] = useState('');
    const [priority, setPriority] = useState('100');

    const refreshRoutes = () => {
        Bonfire.sACN.getRoutes().then(setRoutes);
    };

    const refreshConfig = () => {
        Bonfire.sACN.getConfig().then((data) => {
            setFramerate(`${data.framerate}`);
        });
    };

    const switchSelection = (index) => {
        if (index >= 0) {
            const route = routes[index];

            setSourceUniverse(route.sourceUniverse);
            setDestinationUniverse(route.destinationUniverse);
            setOutputType(
                route.destination === MULTICAST ? 'Multicast' : 'Unicast',
            );
            setUnicastDestination(
                route.destination === MULTICAST ? '' : route.destination,
            );
            setPriority(route.priority);
        } else {
            setSourceUniverse('');
            setDestinationUniverse('');
            setOutputType('Multicast');
            setUnicastDestination('');
            setPriority('100');
        }

        setSelection(index);
    };

    const createRoute = () => {
        Bonfire.sACN
            .createRoute({
                sourceUniverse: parseInt(sourceUniverse, 10),
                destinationUniverse: parseInt(destinationUniverse, 10),
                destination:
                    outputType === 'Multicast' ? MULTICAST : unicastDestination,
                priority: parseInt(priority, 10),
            })
            .then(refreshRoutes);
    };

    const deleteRoute = () => {
        Bonfire.sACN.deleteRoute(selection).then(refreshRoutes);
        setSelection(-2);
    };

    const editRoute = () => {
        Bonfire.sACN
            .editRoute({
                id: selection,
                sourceUniverse: parseInt(sourceUniverse, 10),
                destinationUniverse: parseInt(destinationUniverse, 10),
                destination:
                    outputType === 'Multicast' ? MULTICAST : unicastDestination,
                priority: parseInt(priority, 10),
            })
            .then(refreshRoutes);
    };

    const saveConfig = () => {
        Bonfire.sACN.setConfig({
            framerate: parseInt(framerate, 10),
        });
    };

    useEffect(refreshRoutes, []);
    useEffect(refreshConfig, []);

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
                            ACTIVE OUTPUTS
                        </Typography>
                    </ListItem>
                    {routes.map(
                        (route, index) =>
                            route !== undefined && (
                                <ListItem>
                                    <PatchContainer
                                        key={route.id}
                                        active={selection === index}
                                        onClick={() => switchSelection(index)}
                                        sourceUniverse={route.sourceUniverse}
                                        destinationUniverse={
                                            route.destinationUniverse
                                        }
                                        destination={route.destination.toUpperCase()}
                                    />
                                </ListItem>
                            ),
                    )}
                    <ListItem
                        style={{
                            textAlign: 'center',
                        }}
                    >
                        <IconButton
                            icon={faAdd}
                            onClick={() => switchSelection(-1)}
                        />
                    </ListItem>
                </List>

                <EditPanel>
                    {selection === -1 && (
                        <Typography
                            fontSize="16pt"
                            margin="0 0 40px 0"
                            fontWeight="200"
                        >
                            New Universe Output
                        </Typography>
                    )}
                    {selection >= 0 && (
                        <Typography
                            fontSize="16pt"
                            margin="0 0 40px 0"
                            fontWeight="200"
                        >
                            Edit Output
                        </Typography>
                    )}
                    {selection > -2 && (
                        <>
                            <Input
                                label="Source Universe"
                                value={sourceUniverse}
                                onChange={(e) =>
                                    setSourceUniverse(e.target.value)
                                }
                                style={{
                                    marginBottom: '30px',
                                }}
                            />
                            <Input
                                label="Destination Universe"
                                value={destinationUniverse}
                                onChange={(e) =>
                                    setDestinationUniverse(e.target.value)
                                }
                                style={{
                                    marginBottom: '10px',
                                }}
                            />
                            <Dropdown
                                label="Output Type"
                                style={{
                                    marginBottom: '10px',
                                }}
                                value={outputType}
                                onChange={setOutputType}
                            >
                                <DropdownItem label="Multicast" />
                                <DropdownItem label="Unicast" />
                            </Dropdown>
                            {outputType === 'Unicast' && (
                                <Input
                                    label="Unicast Destination"
                                    value={unicastDestination}
                                    onChange={(e) =>
                                        setUnicastDestination(e.target.value)
                                    }
                                    style={{
                                        marginBottom: '30px',
                                    }}
                                />
                            )}
                            <Input
                                label="Priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                style={{
                                    marginBottom: '20px',
                                }}
                            />
                            <Button
                                onClick={
                                    selection === -1 ? createRoute : editRoute
                                }
                                style={{
                                    marginRight: '10px',
                                }}
                            >
                                {selection === -1 ? 'Create' : 'Save'}
                            </Button>
                            {selection >= 0 && (
                                <Button onClick={deleteRoute}>Delete</Button>
                            )}
                        </>
                    )}
                </EditPanel>
            </PatchesPanel>
            <PropertyPanel>
                <Typography marginTop="15px" marginBottom="50px">
                    sACN Options
                </Typography>
                <Input
                    label="Framerate"
                    style={{
                        width: '100px',
                        marginBottom: '20px',
                    }}
                    value={framerate}
                    onChange={(e) => setFramerate(e.target.value)}
                />
                <Button onClick={saveConfig}>Save</Button>
            </PropertyPanel>
        </Container>
    );
}
