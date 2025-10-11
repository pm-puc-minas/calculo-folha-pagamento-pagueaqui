module.exports = {
  'hrpayroll-api': {
    input: {
      target: 'http://localhost:8080/v3/api-docs',
    },
    output: {
      mode: 'tags-split',
      target: 'app/lib/api/generated',
      client: 'react-query',
      prettier: true,
      override: {
        mutator: {
          path: 'app/lib/axios.ts',
          name: 'customInstance',
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
};