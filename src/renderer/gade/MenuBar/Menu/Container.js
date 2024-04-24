import styled from "styled-components";

export const Container = styled.div`
    display: table;
    height: 100%;
    vertical-align: middle;

    padding: 0 10px;

    p {
        display: table-cell;
        vertical-align: middle;

        color: #DDDDDD;
        font-family: "Segoe UI Light", "Roboto", sans-serif;
        font-weight: 300;
        font-size: 11pt;
    }

    &:hover {
        background: #55555555;
    }
`;
