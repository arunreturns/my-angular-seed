var fs = require('fs');
var prompt = require('prompt');
var colors = require('colors');

var centerPrint = (str, length) => {
    var extraPadding = length - str.length;
    var centeredString = str + " ".repeat(extraPadding);
    var test = centeredString.split('');
    test.unshift(" ".repeat(extraPadding/2));
    test.splice(extraPadding/2 + str.length, extraPadding/2);
    return test.join('');
};

console.log(colors.cyan("*".repeat(45)));
console.log(colors.cyan(centerPrint("Angular 2 Component Creator", 45)));
console.log(colors.cyan("*".repeat(45)));

prompt.message = '';
prompt.start();

const inputList = [
    {
        name: 'basePath',
        description: colors.gray('Enter your base app path'),
        type: 'string',
        default: 'app'
    },
    {
        name: 'componentName',
        description: colors.gray('Enter your component name'),
        type: 'string',
        default: 'my-element'
    },
];

prompt.get(inputList, function(err, result) {
    if (err) {
        return onErr(err);
    }
    createComponent(result.basePath, result.componentName, getClassName(result.componentName));
});

function onErr(err) {
    console.log(err);
    return 1;
}

var capitalize = (str) => {
    return str.substring(0, 1).toUpperCase() + str.substring(1);
};

var getClassName = (componentName) => {
    return componentName.split('-').map((item) => {
        return capitalize(item);
    }).join('') + 'Component';
};

var getComponentContent = (basePath, componentName, className) => {
    return `import { Component } from '@angular/core';
@Component({
    selector: '${componentName}',
    templateUrl: '${basePath}/${componentName}/${componentName}.component.html',
    styleUrls: ['${basePath}/${componentName}/${componentName}.component.css']
})

export class ${className} { }
`;
};

var getHtmlContent = (className) => {
    return `<div>
    This is ${className}
</div>
    `;
};

var createComponent = (basePath, componentName, className) => {
    try {
        console.log(colors.cyan("*".repeat(45)));
        try {
            process.chdir(basePath);
        }
        catch (e) {
            console.log(colors.yellow("ERROR: Cannot change dir to base [" + basePath + "]"));
            console.log(colors.green("Creating new base"));
            fs.mkdirSync(basePath);
            process.chdir(basePath);
        }

        console.log(colors.green("Creating directory", componentName));
        fs.mkdirSync(componentName);
        process.chdir(componentName);
        console.log(colors.green("Creating Component " + componentName + '.component.ts'));
        fs.writeFileSync(componentName + '.component.ts', getComponentContent(basePath, componentName, className));
        console.log(colors.green("Creating HTML " + componentName + '.component.html'));
        fs.writeFileSync(componentName + '.component.html', getHtmlContent(className));
        console.log(colors.green("Creating CSS " + componentName + '.component.css'));
        fs.writeFileSync(componentName + '.component.css', '');

        console.log(colors.cyan("*".repeat(45)));
    }
    catch (e) {
        console.error(colors.red("ERROR: ", e));
    }
};