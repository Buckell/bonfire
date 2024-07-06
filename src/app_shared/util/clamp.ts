export default (value: number, min: number, max: number) =>
    // eslint-disable-next-line no-nested-ternary
    value > max ? max : value < min ? min : value;
