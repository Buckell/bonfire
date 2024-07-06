import styled from 'styled-components';

export const Container = styled.div`
    position: relative;

    width: 100%;

    font-family: 'Inter', sans-serif;
    font-size: 12pt;
    font-weight: 300;
    color: white;

    &.selectable {
        cursor: pointer;

        &:hover {
            ::after {
                display: block;
                position: absolute;
                content: '';
                width: 2px;
                left: 7px;
                top: 3px;
                bottom: 3px;

                background-color: #999999;
            }
        }
    }

    &.selected {
        ::after {
            display: block;
            position: absolute;
            content: '';
            width: 2px;
            left: 7px;
            top: 3px;
            bottom: 3px;

            background-color: #ffffff;
        }
    }
`;
