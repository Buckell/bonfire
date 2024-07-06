import Intensity from './Intensity';
import Color from './Color';

const attributeRegistry: { [key: string]: any } = {};

// eslint-disable-next-line no-return-assign
export const registerAttributeType = (Attribute: any) =>
    (attributeRegistry[new Attribute().type] = Attribute);

registerAttributeType(Intensity);
registerAttributeType(Color);

export default attributeRegistry;
