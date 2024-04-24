import styled from "styled-components";

export const Container = styled.div`
    position: relative;
    height: 5px;
    width: 100%;

    span {
        display: block;
        position: absolute;
        top: 2px;
        bottom: 2px;
        left: 0;
        right: 0;
        background-color: #333;
    }
`;
