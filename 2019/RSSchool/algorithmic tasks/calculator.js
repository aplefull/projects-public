function expressionCalculator(expr) {
    let stack = [];
    let postfix = [];
    let str1;
    let str2;
    let buff = '';

    expr = expr.replace(/\s/g, '');

    if ((expr.match(/\)/g) || []).length !== (expr.match(/\(/g) || []).length) {
        throw ('ExpressionError: Brackets must be paired');
    }

    for (let i = 0; i < expr.length; i++) {
        if (isSign(expr[i])) {
            if (stack.length === 0 || precedence(expr[i]) > precedence(stack[stack.length - 1]) || stack[stack.length - 1] === '(') {
                stack.push(expr[i]);
            }

            else {
                while (stack.length > 0 && (stack[stack.length - 1] !== '(' && precedence(expr[i]) <= precedence(stack[stack.length - 1]))) {
                    postfix.push(stack.pop());
                }
                stack.push(expr[i]);
            }
            continue;
        }

        else if (isClosingBracket(expr[i])) {
            while (stack[stack.length - 1] !== '(' && stack.length > 0) {
                postfix.push(stack.pop());
            }
            stack.pop();
            continue;
        }

        else {

            while (!isSign(expr[i]) && expr[i] !== ')' && i < expr.length) {
                buff = buff + expr[i];
                i++;
            }
            postfix.push(buff);
            buff = '';
            i--;
        }
    }

    while (stack.length > 0) {
        postfix.push(stack.pop());
    }

    for (let i = 0; i < postfix.length; i++) {
        if (!isSign(postfix[i])) {
            stack.push(postfix[i]);
        }

        else {
            str2 = stack.pop();
            str1 = stack.pop();

            switch (postfix[i]) {
                case '*': stack.push(parseFloat(str1, 10) * parseFloat(str2, 10)); break;
                case '/': if (str2 === '0' || str2 === 0) {
                    throw ('TypeError: Division by zero.');
                }

                else {
                    stack.push(parseFloat(str1, 10) / parseFloat(str2, 10));
                } break;

                case '+': stack.push(parseFloat(str1, 10) + parseFloat(str2, 10)); break;
                case '-': stack.push(parseFloat(str1, 10) - parseFloat(str2, 10)); break;
            }
        }
    }

    return stack[0];
}

function precedence(ch) {
    switch (ch) {
        case '+': return 1;
        case '-': return 1;
        case '*': return 2;
        case '/': return 2;
        case '(': return 3;
    }
}

function isSign(ch) {
    if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '(') return true;
    return false;
}

function isClosingBracket(ch) {
    if (ch === ')') return true;
    return false;
}
