import {Container} from "./Container";
import {Body} from "./Body";
import {useEffect, useRef, useState} from "react";
import DropArrow from "./DropArrow";
import {Selection} from "./Selection";
import DropdownItem from "./DropdownItem";

export default function Dropdown(props) {
    const [internalValue, setInternalValue] = useState(props.defaultValue || "");
    const [expanded, setExpanded] = useState(false);

    const value = props.value || internalValue || "";
    const valueLower = value.toLowerCase();

    const onChange = (e) => {
        if (!props.value) {
            setInternalValue(e);
        }

        props.onChange?.(e);
    };

    useEffect(() => setInternalValue(props.value), [props.value]);

    const children = Array.isArray(props.children) ? props.children : [props.children];

    const labels = children.map((child) => child.props.label);

    const searching = value !== "" && !labels.includes(value);

    const close = () => setTimeout(() => setExpanded(false), 200);

    return (
        <Container style={props.style} className={props.disabled && "disabled"}>
            {props.label && <p>{props.label}</p>}


            <div style={{ position: "relative" }}>
                <Body
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onClick={() => setExpanded(true)}
                    onBlur={close}
                    placeholder={props.placeholder}
                    disabled={props.disabled}
                />

                <DropArrow expanded={expanded} />
            </div>

            <Selection
                style={{
                    display: expanded ? "initial" : "none"
                }}
            >
                {
                    (searching ?
                    children.filter((child) => child.props?.label?.toLowerCase().includes(valueLower)) :
                    children)
                    .map((item) => (
                        <DropdownItem
                            key={item.props.label}
                            onClick={() => {
                                setExpanded(false);
                                onChange(item.props.label);
                            }}
                        >
                            {item.props.label || item.children}
                        </DropdownItem>
                    ))
                }
            </Selection>
        </Container>
    );
}
