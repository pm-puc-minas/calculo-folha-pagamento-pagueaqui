import { defineConfig } from 'orval';

export default defineConfig({
  'hr-payroll': {
    input: {
      target: './api-docs/swagger.json',
    },
    output: {
      target: './actions/hr-payroll/index.ts',
      client: 'react-query',
      override: {
        mutator: {
          path: './app/lib/axios-orval.ts',
          name: 'api',
        },
      },
    },
  },
  'public-auth': {
    input: {
      target: './api-docs/swagger.json',
      filters: {
        tags: ['PublicAuth'],
      },
    },
    output: {
      target: './actions/public-auth/public-auth.ts',
      client: 'react-query',
      override: {
        mutator: {
          path: './app/lib/axios-orval.ts',
          name: 'api',
        },
      },
    },
  },
  'hr-auth': {
    input: {
      target: './api-docs/swagger.json',
      filters: {
        tags: ['EmployeeAuth'],
      },
    },
    output: {
      target: './actions/hr-auth/hr-auth.ts',
      client: 'react-query',
      override: {
        mutator: {
          path: './app/lib/axios-orval.ts',
          name: 'api',
        },
      },
    },
  },
});