import styled from 'styled-components';

export const Slider = styled.input`
    appearance: none;
    background: #181818;
    border: solid 1px #3f4144;
    border-radius: 5px;
    width: 200px;
    height: 12px;
    transform: rotate(-90deg) translateX(calc(-200px / 2)) translateY(-73px);

    &::-webkit-slider-thumb {
        position: relative;
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 40px;
        cursor: pointer;
        border: solid 6px white;
        border-top-width: 8px;
        border-bottom-width: 8px;
        border-radius: 3px;
    }
`;
