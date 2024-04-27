import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Label } from './Label';

let labelRootElement = document.getElementById('popup-label');

if (!labelRootElement) {
    labelRootElement = document.createElement('div');
    labelRootElement.id = 'popup-label';
    labelRootElement.style.display = 'none';
    labelRootElement.style.position = 'fixed';
    document.body.appendChild(labelRootElement);
    const labelRoot = createRoot(labelRootElement);
    labelRoot.render(<Label />);
}

export default function Tooltip(props) {
    const { children, label, pos, delay } = props;

    const [hovered, setHovered] = useState(false);
    const [visible, setVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState(0);
    const containerRef = useRef();

    useEffect(() => {
        if (hovered && timeoutId === 0) {
            const hoverDelay = delay === undefined ? 500 : delay;

            clearTimeout(timeoutId);
            setTimeoutId(
                setTimeout(() => {
                    setVisible(true);
                    setTimeoutId(0);
                }, hoverDelay),
            );
        } else if (!hovered) {
            clearTimeout(timeoutId);
            setTimeoutId(0);
            setVisible(false);
        }
    }, [delay, hovered, timeoutId]);

    useEffect(() => {
        const labelElement = labelRootElement.children[0];

        labelRootElement.style.display = visible ? 'initial' : 'none';
        labelElement.innerHTML = label;

        const rect = containerRef.current?.children[0].getBoundingClientRect();
        const labelRect = labelElement.getBoundingClientRect();

        const absPos = [
            { left: -1000, right: -1000 },
            {
                left: rect.x + (rect.width - labelRect.width) / 2,
                top: rect.y - rect.height - 5,
            },
            {
                left: rect.x + rect.width + 5,
                top: rect.y + (rect.height - labelRect.height) / 2,
            },
            {
                left: rect.x + (rect.width - labelRect.width) / 2,
                top: rect.y + rect.height + 5,
            },
            {
                left: rect.x - labelRect.width - 5,
                top: rect.y + (rect.height - labelRect.height) / 2,
            },
            {
                left: rect.x,
                top: rect.y + rect.height + 5,
            },
            {
                left: rect.x - (labelRect.width - rect.width),
                top: rect.y + rect.height + 5,
            },
        ][pos];

        labelRootElement.style.left = `${absPos.left}px`;
        labelRootElement.style.top = `${absPos.top}px`;
    }, [visible, label, pos]);

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => setHovered(false)}
            ref={containerRef}
            style={{
                display: 'inline',
            }}
        >
            {children}
        </div>
    );
}

Tooltip.TOP = 1;
Tooltip.RIGHT = 2;
Tooltip.BOTTOM = 3;
Tooltip.LEFT = 4;
Tooltip.BOTTOM_RUNRIGHT = 5;
Tooltip.BOTTOM_RUNLEFT = 6;
