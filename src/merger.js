import * as fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import figures from './figures';
import { buildSchema } from 'graphql';
import { printSchemaWithDirectives } from '@graphql-tools/utils'

export function giraffqlMergeSchemas(inputSchema, output) {
    try {
        const schema = buildSchema(inputSchema.definition);
        const byteData = printSchemaWithDirectives(schema);
        if(!fs.existsSync(path.dirname(output))) {
            fs.mkdirSync(path.dirname(output), {recursive: true}, (error) => {
                console.error(error);
            });
        }
        fs.writeFileSync(output, byteData, (error) => {
            console.error(error);
        });
        console.log(chalk.green(`${figures.tick} Schema files merged to ${output}\n`));
    } catch (error) {
        console.error(error)
        return 1;
    }
    return 0;
}
