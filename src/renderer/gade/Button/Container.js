import styled from 'styled-components';

export const Container = styled.div`
    display: inline-block;

    button {
        border: hidden;
        background: #151515;
        border-radius: 7px;
        height: 30px;
        padding-left: 12px;
        padding-right: 12px;
        width: 100%;

        font-family: 'Inter', sans-serif;
        font-size: 10pt;
        font-weight: 500;
        color: #cccccc;

        outline: solid 1px #394348;

        cursor: pointer;
    }

    p {
        font-family: 'Inter', sans-serif;
        font-size: 8pt;
        color: #aaaaaa;
        margin-bottom: 4px;
        margin-left: 4px;
    }

    button:hover {
        background: #1f1f1f;
        outline: solid 1px #405259;
    }

    button:active {
        background: #101010;
    }

    &.disabled * {
        filter: brightness(0.8);
        cursor: not-allowed;
    }
`;
