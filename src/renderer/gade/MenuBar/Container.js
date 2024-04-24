import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    height: 40px;
    
    background-color: #1e2024;

    -webkit-user-select: none;
    -webkit-app-region: drag;
    
    * {
        -webkit-app-region: no-drag;
    }
`;