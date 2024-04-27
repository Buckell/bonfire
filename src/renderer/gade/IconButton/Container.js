import styled from 'styled-components';

export const Container = styled.div`
    display: inline-block;
    border-radius: 7px;

    button {
        border: hidden;
        border-radius: inherit;

        background: #00000000;
        width: 35px;
        height: 35px;

        font-family: 'Inter', sans-serif;
        font-size: 10pt;
        font-weight: 500;
        color: #cccccc;

        cursor: pointer;

        svg {
            vertical-align: middle;
            text-align: center;
            width: 20px;
            height: 20px;
        }
    }

    button:hover {
        background: #333;
    }

    button:active {
        background: #00000000;
    }

    &.disabled * {
        filter: brightness(0.8);
        cursor: not-allowed;
    }
`;
