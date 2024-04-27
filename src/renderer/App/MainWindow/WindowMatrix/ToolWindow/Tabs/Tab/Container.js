import styled from 'styled-components';

export const Container = styled.div`
    height: 30px;

    user-select: none;

    border-right: solid 1px #333;

    background: #1c1e1f;

    &.active {
        background: #2b2f31;

        div {
            p,
            svg {
                color: #dddddd;
            }
        }
    }

    div {
        display: table;
        height: 30px;
        margin-right: 10px;

        svg {
            display: table-cell;
            margin: 7px 7px 7px 7px;
            vertical-align: middle;
            height: 16px;
            color: #bbbbbb;
        }

        p {
            display: table-cell;
            max-width: 100%;
            white-space: nowrap;
            vertical-align: middle;
            font-size: 10.5pt;
            font-weight: 400;
            color: #bbbbbb;
            font-family: 'Inter', sans-serif;
        }
    }
`;
