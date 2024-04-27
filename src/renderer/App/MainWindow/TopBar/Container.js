import styled from 'styled-components';

export const Container = styled.div`
    position: fixed;
    top: 40px;
    left: 0;
    right: 0;
    height: 50px;
    border-bottom: solid 1px #171717;
    background: #212325;

    display: flex;
    flex-direction: row;
    justify-content: space-between;

    div {
        margin: 0 10px;
        display: table;

        & > * {
            display: table-cell;
            vertical-align: middle;
        }
    }

    z-index: 1000;
`;
