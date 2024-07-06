import styled from 'styled-components';

export const Table = styled.table`
    width: 100%;

    td,
    th {
        margin: 0;
        padding: 0;
    }

    thead {
        th {
            margin: 0;
            padding: 0;
        }

        tr:first-child th {
            padding-bottom: 5px;

            text-align: center;
            font-size: 10pt;
            font-weight: 700;
            color: #bbbbbb;
        }

        tr:nth-child(2) th {
            width: 60px;
            padding-bottom: 5px;

            text-align: center;
            font-size: 10pt;
            text-transform: uppercase;
            color: #999;
            font-weight: 600;

            &.spacer {
                width: 30px;
            }
        }
    }

    tbody {
        td {
            margin: 0;
            padding: 0;

            width: 60px;
        }

        td.spacer {
            width: 30px;
        }

        td:last-of-type {
            width: auto;
            border-top-right-radius: 7px;
            border-bottom-right-radius: 7px;
        }

        tr:first-of-type td:first-of-type {
            border-top-left-radius: 7px;
        }

        tr:last-of-type td:first-of-type {
            border-bottom-left-radius: 7px;
        }

        tr.selected {
            background: #385056;
        }
    }
`;
