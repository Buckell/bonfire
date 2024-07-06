import styled from 'styled-components';

export const ContentGrid = styled.div`
    display: flex;
    justify-content: left;
    flex-direction: row;
    align-items: flex-start;

    margin: 25px 0 0 25px;

    div {
        margin-right: 20px;

        svg {
            color: white;
            font-size: 35px;
        }
    }
`;
