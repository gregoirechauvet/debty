import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  client: 'legacy/angular',
  input: '../api/main.yaml',
  output: 'src/client',
});