import { Container } from './Container';
import Typography from '../../../../gade/Typography';
import { HeaderLine } from './HeaderLine';
import { Table } from './Table';
import FixtureRow from './FixtureRow';
import { Bonfire } from '../../../bonfire';

export default function ComplexFixtureBlock(props) {
    const { children, device } = props;

    const [selected, setSelected] = Bonfire.useSelectedChannels();

    if (device === undefined) {
        return <Container />;
    }

    const { attributeDisplay, channelConfiguration } = device;

    const childrenArray = Array.isArray(children) ? children : [children];

    return (
        <Container>
            <Typography
                fontSize="10pt"
                fontWeight="500"
                color="#999999"
                marginBottom="0"
                display="inline-block"
            >
                ColorSource PAR
            </Typography>
            <HeaderLine />

            <Table>
                <thead>
                    <tr>
                        <th>Channel</th>
                        <th width="spacer" />

                        {attributeDisplay.map((attributeDisplayEntry) => (
                            <>
                                <th
                                    key={
                                        attributeDisplayEntry.type +
                                        attributeDisplayEntry.index
                                    }
                                    colSpan={
                                        attributeDisplayEntry.channels.length
                                    }
                                >
                                    {
                                        channelConfiguration
                                            .attributeDefinitions[
                                            attributeDisplayEntry.type
                                        ][attributeDisplayEntry.index].name
                                    }
                                </th>
                                <th className="spacer" />
                            </>
                        ))}
                    </tr>
                    <tr>
                        <th>#</th>
                        <th className="spacer" />

                        {attributeDisplay.map((attributeDisplayEntry) => (
                            <>
                                {attributeDisplayEntry.channels.map(
                                    (channel) => (
                                        <th
                                            key={
                                                attributeDisplayEntry.type +
                                                attributeDisplayEntry.index +
                                                channel.channel
                                            }
                                        >
                                            {channel.label}
                                        </th>
                                    ),
                                )}
                                <th className="spacer" />
                            </>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {childrenArray.map((entry, index) => {
                        if (entry === undefined) {
                            return undefined;
                        }

                        const { channel, initialData } = entry.props;

                        return (
                            <FixtureRow
                                channel={channel}
                                attributeDisplay={attributeDisplay}
                                initialData={initialData}
                                top={index === 0}
                                bottom={index === childrenArray.length - 1}
                                onClick={() => {
                                    if (selected.includes(channel)) {
                                        setSelected(
                                            selected.filter(
                                                (selectedNum) =>
                                                    selectedNum !== channel,
                                            ),
                                        );
                                    } else {
                                        setSelected([...selected, channel]);
                                    }
                                }}
                                selected={selected.includes(channel)}
                            />
                        );
                    })}
                </tbody>
            </Table>
        </Container>
    );
}
