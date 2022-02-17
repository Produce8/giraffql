import * as fs from 'fs';
import { buildSchema, printSchema } from 'graphql';

export function mergeSchemas(inputSchema, output) {
    try {
        const schema = buildSchema(inputSchema.definition, {});
        const byteData = printSchema(schema);
        fs.writeFileSync(output, byteData, (error) => {
            console.error(error);
        });
        return 0;
    } catch (error) {
        console.error(error)
        return 1;
    }
}
