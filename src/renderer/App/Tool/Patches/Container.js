import styled from 'styled-components';

export const Container = styled.div`
    overflow-y: scroll;

    max-height: 100%;

    table {
        margin: 20px;

        font-family: 'Inter', sans-serif;
        color: white;

        th {
            font-weight: 300;
            font-size: 9pt;
            padding-bottom: 10px;
        }

        td {
            padding: 0;
        }
    }
`;
