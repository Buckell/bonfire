import TRANSMISSION from './transmission';
import shared from './shared';
import hooks from './hooks';

const GADE = {
    ...TRANSMISSION,
    hooks,
    shared,
};

export default GADE;
