import styled from 'styled-components';

export const Container = styled.div`
    position: relative;
    height: 30px;
    width: 200px;
    max-width: 100%;
    outline: solid 1px #394348;
    font-size: 10.5pt;
    border-radius: 7px;

    input {
        border: hidden;
        background: #151515;
        padding-left: 12px;
        padding-right: 12px;
        height: calc(100% - 1px);
        border-radius: inherit;
        width: calc(100% - 24px);

        font-family: 'Roboto', sans-serif;
        font-size: inherit;
        font-weight: 300;
        color: #dddddd;

        &.read-only {
            cursor: default;
        }
    }

    p {
        position: absolute;
        top: -28px;
        height: 12px;
        font-family: 'Inter', sans-serif;
        font-size: 8pt;
        color: #aaaaaa;
        margin-bottom: 4px;
        margin-left: 4px;
    }

    input:focus {
        outline: solid 2px #405259;
    }

    &.disabled * {
        cursor: not-allowed;
        filter: brightness(0.8);
    }
`;
