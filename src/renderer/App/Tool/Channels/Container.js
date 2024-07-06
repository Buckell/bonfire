import styled from 'styled-components';

export const Container = styled.div`
    overflow-y: scroll;

    max-height: 100%;

    table {
        margin: 10px;
        color: white;
        font-family: 'Inter', sans-serif;
        font-size: 12pt;

        border-collapse: collapse;
        border: hidden 2px white;

        user-select: none;

        text-align: center;

        td,
        th {
            padding: 3px 5px;
            border: hidden 1px white;
        }

        thead {
            text-align: left;

            th {
                font-weight: 500;
            }
        }

        tr.active td {
            color: #399696;
            font-weight: 700;
        }
    }
`;
