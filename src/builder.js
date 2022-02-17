import { fs } from 'fs';
import * as tools from "graphql-schema-utilities";

export async function build(options) {
    const input = options.input;
    const output = options.output;
    try {
        const schema = await tools.mergeGQLSchemas(input);
        const fileData = printSchema(schema);
        fs.writeFile(output, fileData, (error) => {
            console.error(error);
        });
    } catch (error) {
        console.error(error)
    }
}
