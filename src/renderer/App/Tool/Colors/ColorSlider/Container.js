import styled from 'styled-components';

export const Container = styled.div`
    user-select: none;

    div.slider {
        margin: 10px 10px 0 10px;
        height: 60px;
        width: calc(100% - 20px);

        canvas {
            display: inline-block;
            width: calc(100% - 18px);
            height: 100%;
            background-color: #ffffff;
        }

        p {
            display: inline-block;
            writing-mode: vertical-rl;
            text-orientation: mixed;
            text-align: center;
            width: 18px;
            height: 100%;
            padding: 0;
            margin: 0;

            font-family: 'Inter', sans-serif;
            font-size: 8pt;
            text-transform: uppercase;
            color: #999;
            font-weight: 600;
        }
    }
`;
