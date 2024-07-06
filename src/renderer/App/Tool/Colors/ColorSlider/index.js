import { createRef, useCallback, useEffect, useState } from 'react';
import { Container } from './Container';
import { mapRange } from '../../../../../app_shared/util/mapRange';

const profiles = {
    RGB: {
        sliders: [
            {
                label: 'Red',
                range: [0, 255],
            },
            {
                label: 'Green',
                range: [0, 255],
            },
            {
                label: 'Blue',
                range: [0, 255],
            },
        ],
        transform: (r, g, b) => `rgb(${r} ${g} ${b})`,
    },
    LAB: {
        sliders: [
            {
                label: 'L',
                range: [0, 100],
            },
            {
                label: 'A',
                range: [-128, 128],
            },
            {
                label: 'B',
                range: [-128, 128],
            },
        ],
        transform: (l, a, b) => `lab(${l}% ${a} ${b})`,
    },
    HSL: {
        sliders: [
            {
                label: 'Hue',
                range: [0, 360],
            },
            {
                label: 'SAT.',
                range: [0, 100],
            },
            {
                label: 'LIGHT.',
                range: [0, 100],
            },
        ],
        transform: (h, s, l) => `hsl(${h}deg ${s}% ${l}%)`,
    },
};

const fixCanvasBounds = (canvas) => {
    const boundingRect = canvas.getBoundingClientRect();
    canvas.width = boundingRect.width;
    canvas.height = boundingRect.height;
};

export default function ColorSlider(props) {
    const { value, profile, onChange } = props;

    const [changing, setChanging] = useState(false);
    const [slideRefs, setSlideRefs] = useState([]);

    const profileData = profiles[profile || 'RGB'];

    useEffect(() => {
        setSlideRefs(profileData.sliders.map(() => createRef()));
    }, [profile, profileData.sliders]);

    const redraw = useCallback(() => {
        const canvases = slideRefs.map((ref) => ref.current);

        if (canvases.includes(undefined)) {
            return;
        }

        canvases.forEach(fixCanvasBounds);

        const contexts = canvases.map((canvas) => canvas.getContext('2d'));

        const colorTransform = profileData.transform;

        contexts.forEach((ctx, index) => {
            const sliderWidth = canvases[index].width;
            const sliderHeight = canvases[index].height;
            const valueRange = profileData.sliders[index].range;

            for (let i = 0; i < sliderWidth; ++i) {
                const colorValues = [...value];
                colorValues[index] = mapRange([0, sliderWidth], valueRange, i);
                ctx.fillStyle = colorTransform(...colorValues);
                ctx.fillRect(i, 0, 1, sliderHeight);
            }

            const linePos = mapRange(
                valueRange,
                [0, sliderWidth],
                value[index],
            );
            ctx.fillStyle = '#333333';
            ctx.fillRect(linePos - 2, 0, 5, sliderHeight);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(linePos - 1, 0, 3, sliderHeight);
        });
    }, [profileData.sliders, profileData.transform, slideRefs, value]);

    useEffect(redraw, [redraw]);

    useEffect(() => {
        window.addEventListener('resize', redraw);

        return () => window.removeEventListener('resize', redraw);
    }, [redraw]);

    const onMouseChange = (e, index) => {
        const rect = e.target.getBoundingClientRect();

        onChange(
            index,
            mapRange(
                [0, rect.width],
                profileData.sliders[index].range,
                e.clientX - rect.x,
            ),
        );
    };

    return (
        <Container>
            {slideRefs.map((ref, index) => (
                <div className="slider">
                    <canvas
                        /* eslint-disable-next-line react/no-array-index-key */
                        key={`color-slider-${index}`}
                        ref={ref}
                        onMouseDown={(e) => {
                            setChanging(true);
                            onMouseChange(e, index);
                        }}
                        onMouseUp={() => setChanging(false)}
                        onMouseLeave={() => setChanging(false)}
                        onMouseMove={(e) => {
                            if (changing) {
                                onMouseChange(e, index);
                            }
                        }}
                    />
                    <p>{profileData.sliders[index].label}</p>
                </div>
            ))}
        </Container>
    );
}
