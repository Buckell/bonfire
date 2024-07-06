import { useEffect, useState } from 'react';
import Input from '../../../../gade/Input';
import GADE from '../../../../gade/gade';
import { Bonfire } from '../../../bonfire';

export default function FixtureRow(props) {
    const {
        channel,
        top,
        bottom,
        initialData,
        attributeDisplay,
        onClick,
        selected,
    } = props;
    const channelNumber = channel;

    const [data, setData] = useState(initialData);
    const [values, setValues] = useState([]);

    const refreshValues = () => {
        const values = [];
        attributeDisplay.forEach((display) => {
            const attribute = data.attributes[display.type][display.index];

            display.channels.forEach((channel) => {
                values.push(`${attribute.channels[channel.channel]}`);
            });
        });

        setValues(values);
    };

    GADE.hooks.add('Bonfire.Channel.Update', `C${channel}`, (num, newData) => {
        if (num === channelNumber) {
            setData(newData);
        }
    });

    useEffect(refreshValues, [attributeDisplay, data]);

    let attributeChannelIndex = 0;

    return (
        <tr onClick={onClick} className={selected && 'selected'}>
            <td>
                <Input
                    value={channel}
                    style={{
                        width: '60px',
                        borderRadius: 0,
                        borderTopLeftRadius: top ? '7px' : 0,
                        borderTopRightRadius: top ? '7px' : 0,
                        borderBottomLeftRadius: bottom ? '7px' : 0,
                        borderBottomRightRadius: bottom ? '7px' : 0,
                    }}
                    inputStyle={{
                        background: '#050505',
                        textAlign: 'center',
                        fontSize: '12pt',
                        fontWeight: selected ? 600 : 400,
                        color: selected ? '#5ea6cc' : '#ffffff',
                        cursor: 'default',
                    }}
                    readOnly
                />
            </td>
            <td className="spacer" />
            {attributeDisplay.map((attributeDisplayEntry) => (
                <>
                    {attributeDisplayEntry.channels.map((channel, index) => {
                        const currentChannelIndex = attributeChannelIndex++;

                        return (
                            <td key={currentChannelIndex}>
                                <Input
                                    value={values[currentChannelIndex]}
                                    style={{
                                        width: '60px',
                                        borderRadius: 0,
                                        borderTopLeftRadius:
                                            top && index === 0 ? '7px' : 0,
                                        borderTopRightRadius:
                                            top &&
                                            index ===
                                                attributeDisplayEntry.channels
                                                    .length -
                                                    1
                                                ? '7px'
                                                : 0,
                                        borderBottomLeftRadius:
                                            bottom && index === 0 ? '7px' : 0,
                                        borderBottomRightRadius:
                                            bottom &&
                                            index ===
                                                attributeDisplayEntry.channels
                                                    .length -
                                                    1
                                                ? '7px'
                                                : 0,
                                    }}
                                    inputStyle={{
                                        textAlign: 'center',
                                        fontSize: '12pt',
                                        fontWeight: 400,
                                    }}
                                    onChange={(e) =>
                                        setValues((oldValues) => {
                                            const newValues = { ...oldValues };
                                            newValues[currentChannelIndex] =
                                                e.target.value;
                                            return newValues;
                                        })
                                    }
                                    onBlur={() => {
                                        Bonfire.setChannelAttributeChannel(
                                            channelNumber,
                                            [
                                                attributeDisplayEntry.type,
                                                attributeDisplayEntry.index,
                                                channel.channel,
                                            ],
                                            values[currentChannelIndex],
                                        );
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </td>
                        );
                    })}
                    <td className="spacer" />
                </>
            ))}
            <td />
        </tr>
    );
}
