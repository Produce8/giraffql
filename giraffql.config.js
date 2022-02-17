module.exports = {
    rules: [
        "enum-values-sorted-alphabetically",
        "defined-types-are-used",
        "enum-values-all-caps",
        "fields-are-camel-cased",
        "input-object-fields-sorted-alphabetically",
        "input-object-values-are-camel-cased",
        "interface-fields-sorted-alphabetically",
        "relay-connection-types-spec",
        "relay-connection-arguments-spec",
        "type-fields-sorted-alphabetically",
        "types-are-capitalized",
    ],
    // schemaPaths: ["lib/stacks/graphQl/schema/schema.graphql"],
    // customRulePaths: ["path/to/my/custom/rules/*.js"],
    rulesOptions: {
        "enum-values-sorted-alphabetically": { sortOrder: "lexicographical" },
    },
};
