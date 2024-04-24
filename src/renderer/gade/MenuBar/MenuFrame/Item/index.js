import {Container} from "./Container";
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import GADE from '../../../gade';

export default function Item(props) {
    return (
        <Container
            onMouseEnter={props.onMouseEnter}
            onClick={() => {
                if (props.action) {
                    GADE.send("Menu.Action", props.action);
                }
            }}
        >
            <p>
                <span>
                    {props.label}
                </span>
            </p>

            {props.dropdown && <FontAwesomeIcon className={"dropdown"} icon={faAngleRight} />}
            {props.icon && <FontAwesomeIcon className={"icon"} icon={props.icon} />}
        </Container>
    );
}
