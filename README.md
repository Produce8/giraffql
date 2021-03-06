# giraffql

This package provides a command line tool to merge and validate GraphQL schema definitions against a set of rules.

If you're looking to lint your GraphQL queries, check out this ESLint plugin: [apollographql/eslint-plugin-graphql](https://github.com/apollographql/eslint-plugin-graphql).

## Install

npm:

```
npm install giraffql
```

## Usage

```
Usage: giraffql [options] [schema.graphql ...]


Options:

  -r, --rules <rules>

    only the rules specified will be used to validate the schema

    example: --rules fields-have-descriptions,types-have-descriptions

  -o, --rules-options <rulesOptions>

    configure the specified rules with the passed in configuration options

    example: --rules-options '{"enum-values-sorted-alphabetically":{"sortOrder":"lexicographical"}}'

  -i, --ignore <ignore list>

    ignore errors for specific schema members (see "Inline rule overrides" for an alternative way to do this)

    example: --ignore '{"fields-have-descriptions":["Obvious","Query.obvious","Query.something.obvious"]}'

  -f, --format <format>

    choose the output format of the report

    possible values: compact, json, text

  -s, --stdin

    schema definition will be read from STDIN instead of specified file

  -c, --config-directory <path>

    path to begin searching for config files

  -p, --custom-rule-paths <paths>

    path to additional custom rules to be loaded. Example: rules/*.js

  --comment-descriptions

    use old way of defining descriptions in GraphQL SDL

  --old-implements-syntax

    use old way of defining implemented interfaces in GraphQL SDL

  --version

    output the version number

  -h, --help

    output usage information
```

## Configuration file

In addition to being able to configure `giraffql` via command line options, it can also be configured via
one of the following configuration files.

For now, only `rules`, `schemaPaths`, `customRulePaths`, and `rulesOptions` can be configured in a configuration file, but more options may be added in the future.

### In `package.json`

```json
{
  "giraffql": {
    "rules": ["enum-values-sorted-alphabetically"],
    "schemaPaths": ["path/to/my/schema/files/**.graphql"],
    "customRulePaths": ["path/to/my/custom/rules/*.js"],
    "rulesOptions": {
      "enum-values-sorted-alphabetically": { "sortOrder": "lexicographical" }
    }
  }
}
```

### In `.giraffqlrc`

```json
{
  "rules": ["enum-values-sorted-alphabetically"],
  "schemaPaths": ["path/to/my/schema/files/**.graphql"],
  "customRulePaths": ["path/to/my/custom/rules/*.js"],
  "rulesOptions": {
      "enum-values-sorted-alphabetically": { "sortOrder": "lexicographical" }
    }
}
```

### In `giraffql.config.js`

```js
module.exports = {
  rules: ['enum-values-sorted-alphabetically'],
  schemaPaths: ['path/to/my/schema/files/**.graphql'],
  customRulePaths: ['path/to/my/custom/rules/*.js'],
  rulesOptions: {
    'enum-values-sorted-alphabetically': { sortOrder: 'lexicographical' }
  }
};
```

## Inline rule overrides

There could be cases where a linter rule is undesirable for a specific part of a GraphQL schema.

Rather than disable the rule for the entire schema, it is possible to disable it for that specific part of the schema using an inline configuration.

There are 4 different inline configurations:

- `lint-disable rule1, rule2, ..., ruleN` will disable the specified rules, starting at the line it is defined, and until the end of the file or until the rule is re-enabled by an inline configuration.

- `lint-enable rule1, rule2, ..., ruleN` will enable the specified rules, starting at the line it is defined, and until the end of the file or until the rule is disabled by an inline configuration.

- `lint-disable-line rule1, rule2, ..., ruleN` will disable the specified rules for the given line.

- `lint-enable-line rule1, rule2, ..., ruleN` will enable the specified rules for the given line.

One can use these inline configurations by adding them directly to the GraphQL schema as comments.

```graphql
# lint-disable types-have-descriptions, fields-have-descriptions
type Query {
  field: String
}
# lint-enable types-have-descriptions, fields-have-descriptions

"""
Mutation root
"""
type Mutation {
  """
  Field description
  """
  field: String

  field2: String # lint-disable-line fields-have-descriptions
}
```

**Note:** If you are authoring your GraphQL schema using a tool that prevents you from adding comments, you may use the `--ignore` to obtain the same functionality.

## Built-in rules

### `arguments-have-descriptions`

This rule will validate that all field arguments have a description.

### `defined-types-are-used`

This rule will validate that all defined types are used at least once in the schema.

### `deprecations-have-a-reason`

This rule will validate that all deprecations have a reason.

### `descriptions-are-capitalized`

This rule will validate that all descriptions, if present, start with a capital letter.

### `enum-values-all-caps`

This rule will validate that all enum values are capitalized.

### `enum-values-have-descriptions`

This rule will validate that all enum values have a description.

### `enum-values-sorted-alphabetically`

This rule will validate that all enum values are sorted alphabetically.

Accepts following rule options:

- `sortOrder`: `<String>` - either `alphabetical` or `lexicographical`, defaults: `alphabetical`

### `fields-are-camel-cased`

This rule will validate that object type field and interface type field names are camel cased.

### `fields-have-descriptions`

This rule will validate that object type fields and interface type fields have a description.

### `input-object-fields-sorted-alphabetically`

This rule will validate that all input object fields are sorted alphabetically.

Accepts following rule options:

- `sortOrder`: `<String>` - either `alphabetical` or `lexicographical`, defaults: `alphabetical`

### `input-object-values-are-camel-cased`

This rule will validate that input object value names are camel cased.

### `input-object-values-have-descriptions`

This rule will validate that input object values have a description.

### `interface-fields-sorted-alphabetically`

This rule will validate that all interface object fields are sorted alphabetically.

Accepts following rule options:

- `sortOrder`: `<String>` - either `alphabetical` or `lexicographical`, defaults: `alphabetical`

### `relay-connection-types-spec`

This rule will validate the schema adheres to [section 2 (Connection Types)](https://facebook.github.io/relay/graphql/connections.htm#sec-Connection-Types) of the [Relay Cursor Connections Specification](https://facebook.github.io/relay/graphql/connections.htm).

More specifically:

- Only object type names may end in `Connection`. These object types are considered connection types.
- Connection types must have a `edges` field that returns a list type.
- Connection types must have a `pageInfo` field that returns a non-null `PageInfo` object.

### `relay-connection-arguments-spec`

This rule will validate the schema adheres to [section 4 (Arguments)](https://facebook.github.io/relay/graphql/connections.htm#sec-Arguments) of the [Relay Cursor Connections Specification](https://facebook.github.io/relay/graphql/connections.htm).

More specifically:

- A field that returns a `Connection` must include forward pagination arguments, backward pagination arguments, or both.
- To enable forward pagination, two arguments are required: `first: Int` and `after: *`.
- To enable backward pagination, two arguments are required: `last: Int` and `before: *`.

Note: If only forward pagination is enabled, the `first` argument can be specified as non-nullable (i.e., `Int!` instead of `Int`). Similarly, if only backward pagination is enabled, the `last` argument can be specified as non-nullable.

This rule will validate the schema adheres to [section 5 (PageInfo)](https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo) of the [Relay Cursor Connections Specification](https://facebook.github.io/relay/graphql/connections.htm).

More specifically:

- A GraphQL schema must have a `PageInfo` object type.
- `PageInfo` type must have a `hasNextPage: Boolean!` field.
- `PageInfo` type must have a `hasPreviousPage: Boolean!` field.

### `type-fields-sorted-alphabetically`

This rule will validate that all type object fields are sorted alphabetically.

Accepts following rule options:

- `sortOrder`: `<String>` - either `alphabetical` or `lexicographical`, defaults: `alphabetical`

### `types-are-capitalized`

This rule will validate that interface types and object types have capitalized names.

### `types-have-descriptions`

This will will validate that interface types, object types, union types, scalar types, enum types and input types have descriptions.

## Output formatters

The format of the output can be controlled via the `--format` option.

The following formatters are currently available: `text`, `compact`, `json`.

### Text (default)

Sample output:

```
app/schema.graphql
5:1 The object type `QueryRoot` is missing a description.  types-have-descriptions
6:3 The field `QueryRoot.songs` is missing a description.  fields-have-descriptions

app/songs.graphql
1:1 The object type `Song` is missing a description.  types-have-descriptions

3 errors detected
```

Each error is prefixed with the line number and column the error occurred on.

### Compact

Sample output:

```
app/schema.graphql:5:1 The object type `QueryRoot` is missing a description. (types-have-descriptions)
app/schema.graphql:6:3 The field `QueryRoot.a` is missing a description. (fields-have-descriptions)
app/songs.graphql:1:1 The object type `Song` is missing a description. (types-have-descriptions)
```

Each error is prefixed with the path, the line number and column the error occurred on.

### JSON

Sample output:

```json
{
  "errors": [
    {
      "message": "The object type `QueryRoot` is missing a description.",
      "location": {
        "line": 5,
        "column": 1,
        "file": "schema.graphql"
      },
      "rule": "types-have-descriptions"
    },
    {
      "message": "The field `QueryRoot.a` is missing a description.",
      "location": {
        "line": 6,
        "column": 3,
        "file": "schema.graphql"
      },
      "rule": "fields-have-descriptions"
    }
  ]
}
```

## Exit codes

Verifying the exit code of the `graphql-schema-lint` process is a good way of programmatically knowing the
result of the validation.

If the process exits with `0` it means all rules passed.

If the process exits with `1` it means one or many rules failed. Information about these failures can be obtained by
reading the `stdout` and using the appropriate output formatter.

If the process exits with `2` it means an invalid configuration was provided. Information about this can be obtained by
reading the `stderr`.

If the process exits with `3` it means an uncaught error happened. This most likely means you found a bug.

## Customizing rules

`giraffql` comes with a set of rules, but it's possible that it doesn't exactly match your expectations.

The `--rules <rules>` allows you pick and choose what rules you want to use to validate your schema.

In some cases, you may want to write your own rules. `giraffql` leverages [GraphQL.js' visitor.js](https://github.com/graphql/graphql-js/blob/6f151233defaaed93fe8a9b38fa809f22e0f5928/src/language/visitor.js#L138)
in order to validate a schema.

You may define custom rules by following the usage of [visitor.js](https://github.com/graphql/graphql-js/blob/6f151233defaaed93fe8a9b38fa809f22e0f5928/src/language/visitor.js#L138) and saving your newly created rule as a `.js` file.

You can then instruct `giraffql` to include this rule using the `--custom-rule-paths <paths>` option flag.

For sample rules, see the [`src/rules`](https://github.com/Produce8/giraffql/tree/master/src/rules) folder of this repository or
GraphQL.js' [`src/validation/rules`](https://github.com/graphql/graphql-js/tree/6f151233defaaed93fe8a9b38fa809f22e0f5928/src/validation/rules) folder.
