import {createElement} from "react";

export default function Typography(props) {
    const { element, children } = props;

    const defaultStyle = {
        fontFamily: "'Inter', sans-serif",
        fontWeight: 200,
        color: "#eeeeee"
    };

    return createElement(
        typeof(element) === "string" ? element : "p",
        { style: {...defaultStyle, ...props, element: undefined, children: undefined } },
        children
    );
}