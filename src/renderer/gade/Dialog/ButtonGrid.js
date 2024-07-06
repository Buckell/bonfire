import styled from 'styled-components';

export const ButtonGrid = styled.div`
    position: absolute;
    bottom: 15px;
    right: 15px;

    display: flex;
    justify-content: right;
    flex-direction: row;

    & > div {
        margin-left: 10px;
    }

    & * {
        -webkit-app-region: none;
    }
`;
