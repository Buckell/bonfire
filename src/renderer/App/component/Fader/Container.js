import styled from 'styled-components';

export const Container = styled.div`
    display: inline-block;
    position: relative;
    width: 60px;
    height: 280px;

    input::-webkit-slider-thumb {
        background-color: ${'#000'};
    }
`;
