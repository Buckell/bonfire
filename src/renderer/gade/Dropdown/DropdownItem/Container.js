import styled from "styled-components";

export const Container = styled.div`
    width: calc(100% - 20px);
    padding: 7px 10px;

    font-family: "Inter", sans-serif;
    font-size: 10pt;
    color: #aaaaaa;
    
    cursor: pointer;
    
    user-select: none;
    
    :hover {
        background-color: #333;
    }
`;