import styled from "styled-components";

export const Container = styled.div`
    input {
        border: hidden;
        background: #151515;
        border-radius: 7px;
        height: 30px;
        padding-left: 12px;
        padding-right: 12px;

        font-family: "Roboto", sans-serif;
        font-size: 10pt;
        font-weight: 300;
        color: #dddddd;

        outline: solid 1px #394348;
    }

    p {
        font-family: "Inter", sans-serif;
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
