import { ISnippetSnytax } from "@cucumber/cucumber/lib/formatter/step_definition_snippet_builder/snippet_syntax";

const CALLBACK_NAME = 'callback'


const toCamelCase = function (string_) {
    return string_
        .replace(/\s(.)/g, function ($1) {
            return $1.toUpperCase();
        })
        .replace(/\s/g, '')
        .replace(/\W/g, '')
        .replace(/^(.)/, function ($1) {
            return $1.toLowerCase();
        });
};

class CustomSnippetSyntax implements ISnippetSnytax {
    snippetInterface: any;
    constructor(snippetInterface) {
        this.snippetInterface = snippetInterface
    }

    build({
        comment,
        generatedExpressions,
        functionName,
        stepParameterNames
    }) {

        const implementation = "return 'pending'"

        const definitionChoices = generatedExpressions.map((generatedExpression, index) => {
            const prefix = index === 0 ? '' : '// '

            const methodName = toCamelCase(generatedExpression.expressionTemplate);
            const parameters = [
                ...generatedExpression.parameterTypes.map((parameterType, index) => `${generatedExpression.parameterNames[index]}: ${typeNameOf(parameterType.name)}`),
                ...stepParameterNames.map(name => `${name}: ${name.startsWith('docString') ? 'string' : 'DataTable'}`)
            ];
            let template = generatedExpression.expressionTemplate
            for (const parameter of generatedExpression.parameterTypes) {
                template = template.replace('{%s}', `{${parameter.name}}`)
            }

            const snippet =
                `${prefix}@${functionName.toLowerCase()}('${template}')
${prefix}public async ${methodName}(${parameters.join(', ')}) {`
            return snippet;


            //return `${prefix} @${functionName.toLowerCase()} ${generatedExpression.expressionTemplate.replace(/[^\da-z]+/gi, "_")}('${generatedExpression.source.replace(/'/g, "\\'")}', (${allParameterNames.join(', ')}) {\n`
        })
        //        return snippet;
        return `${definitionChoices.join('\n')}
    // ${comment}
    ${implementation}
};`
    }
}

module.exports = CustomSnippetSyntax

function typeNameOf(name: string) {
    const typeMappings = {
        int: 'number',
        float: 'number',
    }
    return typeMappings[name] || name
}
