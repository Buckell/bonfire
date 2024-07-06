import styled from 'styled-components';

export const Container = styled.div`
    display: inline-block;
    background: #222;

    margin: 25px 0 0 25px;
    border: solid 1px #444;
    border-radius: 5px;
    overflow: hidden;
    width: 60px;

    font-family: 'Inter', sans-serif;
    color: white;
    text-align: center;

    user-select: none;

    h1 {
        margin: 0;
        padding: 5px 0 5px 0;
        font-weight: 600;
        font-size: 13pt;
        background: #111;
    }

    h2 {
        margin: 0;
        padding: 12px 0 12px 0;
        font-weight: 400;
        font-size: 12pt;
        background: #222;
    }

    &.active {
        outline: solid 1px #385056;

        h1 {
            color: #5ea6cc;
        }
    }
`;
