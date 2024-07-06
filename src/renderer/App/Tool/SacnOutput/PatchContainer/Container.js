import styled from 'styled-components';

export const Container = styled.div`
    padding: 8px 0 8px 0;
    text-align: center;

    border-radius: 7px;
    margin: 5px;

    user-select: none;

    &.active {
        background: #313436;
    }

    &:hover {
        transition: background-color 100ms linear;
        background-color: #373b3f;
    }

    div {
        display: flex;
        justify-content: center;

        h1 {
            font-size: 12pt;
            margin: 0;
            font-weight: 500;
            color: #ffffff;

            height: 30px;
        }

        svg {
            margin: 3px 10px 0 10px;
            height: 14px;
        }
    }

    h2 {
        font-size: 9pt;
        margin: -3px 0 0;
        font-weight: 500;
        color: #aaaaaa;
    }
`;
