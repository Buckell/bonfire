import styled from 'styled-components';

export const Container = styled.div`
    display: table;
    position: relative;
    width: calc(100% - 6px);
    height: 24px;
    margin: 3px;

    border-radius: 5px;

    font-family: 'Inter', sans-serif;
    font-size: 9.5pt;
    font-weight: 250;
    color: #ffffff;

    cursor: default;
    user-select: none;

    &:hover {
        background-color: #2a2a59;
    }

    p {
        padding-left: 30px;
        display: table-cell;
        vertical-align: middle;

        span {
            display: block;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 190px;
            overflow: hidden;
        }
    }

    svg.dropdown {
        position: absolute;
        top: 4px;
        bottom: 4px;
        right: 7px;
        font-size: 16px;
        color: #cccccc;
    }

    svg.icon {
        position: absolute;
        top: 4px;
        bottom: 4px;
        left: 5px;
        font-size: 16px;
        color: #cccccc;
    }
`;
