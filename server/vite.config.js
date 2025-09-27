import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';
export default defineConfig({
    test: {
        alias: {
            '#db': resolve('./src/db/db.js')
        }
    }
});
