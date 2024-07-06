import styled from 'styled-components';

export const Container = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    background: #232628;

    border: solid 1px rgba(72, 77, 79, 0.64);

    overflow: hidden;

    & {
        -webkit-app-region: drag;
    }

    & div:first-of-type {
        -webkit-app-region: none;
    }
`;
