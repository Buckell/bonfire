import styled from 'styled-components';

export const Container = styled.div`
    width: 100%;
    height: 30px;
    overflow-x: scroll;
    overflow-y: hidden;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    & > .tab:last-child {
        margin-right: 30px;
    }
`;
