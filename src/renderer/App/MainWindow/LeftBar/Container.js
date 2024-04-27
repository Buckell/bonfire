import styled from 'styled-components';

export const Container = styled.div`
    position: fixed;
    top: 90px;
    left: 0;
    bottom: 0;
    width: 50px;
    border-right: solid 1px #171717;
    background: #212325;

    padding-top: 10px;
    text-align: center;

    button {
        cursor: default;
    }

    z-index: 900;
`;
