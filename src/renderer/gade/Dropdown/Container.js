import styled from 'styled-components';

export const Container = styled.div`
    position: relative;
    display: inline-block;
    width: 200px;

    p {
        font-family: 'Inter', sans-serif;
        font-size: 8pt;
        color: #aaaaaa;
        margin-bottom: 4px;
        margin-left: 4px;
    }

    input:focus {
        outline: solid 2px #405259;
    }

    svg {
        position: absolute;
        right: 0;
        color: white;
    }

    &.disabled * {
        filter: brightness(0.8);
        cursor: not-allowed;
    }
`;
