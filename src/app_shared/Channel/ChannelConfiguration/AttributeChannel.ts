export type AttributeChannel = [string, number, string];

export const parseAttributeChannel = (str: string): AttributeChannel => {
    const [attributeType, indexString, channel]: string[] = str.split(' ');

    return [attributeType, parseInt(indexString, 10), channel];
};
