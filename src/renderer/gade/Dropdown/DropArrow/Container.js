import styled from "styled-components";

const height = "20px";

export const Container = styled.div`
    position: absolute;
    right: 8px;
    top: 50%;
    bottom: 0;
    transform: translateY(-50%);    
    
    svg {
        display: inline-block;
        color: #777777;
    }
`;