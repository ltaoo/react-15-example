const sep = require('path').sep;

let indent = 0;

function renderSpaceWhite(number) {
    return ' '.replace(number);
}

function canInsertConsole(filename) {
    // return true;
	const reactModulePaths = ['node_modules', 'react'];
	const reactDomModulePaths = ['node_modules', 'react-dom'];
    return filename.indexOf(reactModulePaths.join(sep)) > -1
        || filename.indexOf(reactDomModulePaths.join(sep)) > -1;
}

function findIdentifier(path) {
    // console.log(path.node.type);
    if (path.isFunctionDeclaration()) {
        // console.log('isFunctionDeclaration');
        return path.node.id.name;
    }
    if (path.isFunctionExpression()) {
        const expressionStatement = path.findParent((path) => path.isExpressionStatement());
        if (expressionStatement && expressionStatement.node.expression) {
            // console.log('isExpressionStatement');
            if (expressionStatement.node.expression.type === 'AssignmentExpression') {
                const left = expressionStatement.node.expression.left;
                if (left.type === 'MemberExpression') {
                    return left.object.name + '.' + left.property.name;
                }
            }
        }
        const objectPropertyPath = path.findParent((path) => path.isObjectProperty());
        if (objectPropertyPath && objectPropertyPath.node.key) {
            // console.log('isObjectProperty');
            if (path.node.type === 'ArrowFunctionExpression') {
                // console.log(objectPropertyPath.node.key.name);
            }
            return objectPropertyPath.node.key.name;
        }
        const variableDeclaratorPath = path.findParent((path) => path.isVariableDeclarator());
        if (variableDeclaratorPath && variableDeclaratorPath.node.id) {
            // console.log('isVariableDeclarator', variableDeclaratorPath.node);
            return variableDeclaratorPath.node.id.name;
        }
    }
    return 'unknow';
}

const consoleExpression = (t, content, ...params) => t.expressionStatement(
	t.callExpression(
		t.memberExpression(
			t.identifier('console'),
			t.identifier('log'),
		),
		[
			t.stringLiteral(content),
            ...params,
        ],
	),
);

function handle(path, state, t) {
    const { filename } = state.file.opts;
    const { params } = path.node;
	// console.log(filename, reactModulePaths.join(sep), filename.indexOf(reactModulePaths.join(sep)));
	if (canInsertConsole(filename)) {
        const identifier = findIdentifier(path);
		path.node.body.body.unshift(
			consoleExpression(t, `${identifier} start`, ...params),
		);
		// 应该要找有没有 return 语句，在 return 前插入
		// 遍历时的匿名函数
		path.node.body.body.push(
			consoleExpression(t, `${identifier} end`),
		);
		return path;
	}
}

module.exports = function plugin({ types: t }) {
	return {
		name: 'babel-plugin-insert-console',
		visitor: {
			FunctionDeclaration(path, state) {
				handle(path, state, t);
            },
            /**
             * 
             */
			FunctionExpression(path, state) {
				handle(path, state, t);
            },
            ArrowFunctionExpression(path, state) {
				handle(path, state, t);
            },
			VariableDeclaration(path, state) {
				const { filename } = state.file.opts;
			},
			// CallExpression(path) {
			//     if (t.isFunctionExpression(path.node.callee)) {

			//     }
			// },
		},
	};
};
