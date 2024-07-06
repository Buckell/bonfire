import styled from 'styled-components';

export const Container = styled.table`
    outline: solid 1.5px #777777;
    border-radius: 7px;
    overflow: hidden;

    background: #1c1b1f;
    color: white;
    font-family: 'Inter', sans-serif;

    border-collapse: collapse;

    tr {
        th,
        td {
            padding: 3px 5px;
        }

        th {
            font-weight: 300;
            font-size: 12pt;
            text-align: left;
        }

        td {
            border-top: solid 2px #333;
            text-align: center;
        }
    }
`;
