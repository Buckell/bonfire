import { configureStore } from '@reduxjs/toolkit';
import { reducers } from './reducers';

import '../App/reducers';

export default configureStore({
    reducer: reducers,
});
