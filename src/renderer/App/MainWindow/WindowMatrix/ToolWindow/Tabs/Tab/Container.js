import styled from 'styled-components';

export const Container = styled.div`
    height: 40px;

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
        height: 40px;
        margin-right: 12px;

        svg {
            display: table-cell;
            margin: 12px 10px 10px 10px;
            vertical-align: middle;
            height: 18px;
            width: 18px;
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
