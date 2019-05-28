import React from 'react';
import { renderToString } from 'react-dom/server';

import Main from './main';

export default (resource) => renderToString(<Main {...resource.toJSON()} />);
