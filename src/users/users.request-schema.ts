import { ApiBodyOptions } from '@nestjs/swagger';

export const createUserBody: ApiBodyOptions = {
  schema: {
    type: 'object',
    properties: {
      email: { type: 'string', example: 'kelly@hmd.io' },
      name: {
        type: 'string',
        example: 'Kelly',
      },
    },
  },
};

export const updateUserBody: ApiBodyOptions = {
  schema: {
    type: 'object',
    properties: {
      ...createUserBody.schema['properties'],
    },
  },
};
