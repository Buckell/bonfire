import styled from 'styled-components';

export const Container = styled.div`
    position: absolute;
    right: 0;
    height: 30px;
    width: 30px;

    background: #2b2f31;
    border-left: solid 1px #222;

    svg {
        color: #999999;
        height: 20px;
        width: 20px;
        margin: 6px 5px 5px 5px;
    }

    &:hover {
        svg {
            color: #bbbbbb;
        }
    }
`;
