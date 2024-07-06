import GADE from '../../gade/gade';

import appReducer from './app';
import uiConfigReducer from './uiConfig';

GADE.registerReducer('app', appReducer);
GADE.registerReducer('uiConfig', uiConfigReducer);
