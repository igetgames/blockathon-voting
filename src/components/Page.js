import React, { Fragment } from 'react';
import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';

export default ({ title, children, ...props }) => (
  <Fragment>
    <Heading tag='h2'>{title || ''}</Heading>
    <Box pad="medium">
      {children}
    </Box>
  </Fragment>
);
