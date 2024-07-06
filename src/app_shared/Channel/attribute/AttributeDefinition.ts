export default class AttributeDefinition {
    type: string;

    name: string;

    properties: { [key: string]: any };

    constructor(
        type: string,
        name: string,
        properties: { [key: string]: any } = {},
    ) {
        this.type = type;
        this.name = name;
        this.properties = properties;
    }
}
