import { useEffect, useRef } from 'react';

export default function ContextMenu(props) {
    const { children, menu } = props;

    const containerRef = useRef();

    useEffect(() => {
        containerRef.current.menu = menu;
    }, [containerRef, menu]);

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <div
            style={{
                display: 'inline',
            }}
            ref={containerRef}
        >
            {children}
        </div>
    );
}
