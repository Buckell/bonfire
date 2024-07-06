import styled from 'styled-components';

export const Container = styled.div`
    position: absolute;
    right: 0;
    height: 40px;
    width: 40px;

    background: #2b2f31;
    border-left: solid 1px #222;

    svg {
        color: #999999;
        height: 20px;
        width: 20px;
        margin: 10px 10px 8px 10px;
    }

    &:hover {
        svg {
            color: #bbbbbb;
        }
    }
`;
