//dedico esse código à Nossa Senhora

//abreviando funções e comandos
function $(selector) {
	return document.querySelector(selector);
}
//partes do visor
//parte de resultado
const displayResult = $('#result');
const displayExpression = $('#expression');

//botões básicos
const num0    = $('#n0');
const num1    = $('#n1');
const num2    = $('#n2');
const num3    = $('#n3');
const num4    = $('#n4');
const num5    = $('#n5');
const num6    = $('#n6');
const num7    = $('#n7');
const num8    = $('#n8');
const num9    = $('#n9');
const plus    = $('#pl');//mais
const minus   = $('#mi');//menos
const times   = $('#ti');//vezes
const divided = $('#di');//dividido
const point   = $('#po');//ponto flutuante
const equal   = $('#eq');//igual
//botões de manipulação
const deleted = $('#deleted');//deletado
const clear   = $('#clear');//limpar
const openP   = $('#openP');//abrir parenteses
const closeP  = $('#closeP');//fechar parenteses

//clicando nas teclas do controle básico
num0.onclick    = () => {addCharExpression('0')}
num1.onclick    = () => {addCharExpression('1')}
num2.onclick    = () => {addCharExpression('2')}
num3.onclick    = () => {addCharExpression('3')}
num4.onclick    = () => {addCharExpression('4')}
num5.onclick    = () => {addCharExpression('5')}
num6.onclick    = () => {addCharExpression('6')}
num7.onclick    = () => {addCharExpression('7')}
num8.onclick    = () => {addCharExpression('8')}
num9.onclick    = () => {addCharExpression('9')}
point.onclick   = () => {addCharExpression('.')}
plus.onclick    = () => {addCharExpression('+')}
minus.onclick   = () => {addCharExpression('-')}
times.onclick   = () => {addCharExpression('*')}
divided.onclick = () => {addCharExpression('/')}
equal.onclick   = expressionEvaluate;
//clicando nas teclas do controle de manipulação
deleted.onclick = () => {
	if(expression.length > 0) {
		expression = expression.substring(0,expression.length - 1) || null;
		updateDisplay();
	}
}
clear.onclick   = () => {expression = null; updateDisplay('result expression')}
openP.onclick   = () => {addCharExpression('(')}
closeP.onclick  = () => {addCharExpression(')')}

//resultados, expressões e outros que estarão no display
let result = null;
let expression = null;

//constantes auxiliadoras de addCharExpression
const firstChar    = /[\d\(\-\+]/;
const digit        = /\d/;
const lastDigit    = /\d$/;
const lastPoint    = /\.$/;
const numberOne    = /^\d+$/;
const numberInvert = /^\d+[\+\-\*\/\(/)]/;
const lastOperati  = /[\+\-\*\/\(\)]$/;
const operati      = /[\+\-\*\/\(]/;
const operatiPure  = /[\+\-\*\/\^]/;

//evento de digitar
//colocando o valor digitado na expression
//e atualizando o displayExpression
function addCharExpression(char) {
	//apenas quando o diplayExpression está vazio
	if(expression == null) {
		//caracteres aceitos
		  //0 1 2 3 4 5 6 7 8 9 ( - +
		if(firstChar.test(char)) {
			expression = char;
		}
	}
	//depois do primeiro caractere
	else {
		//simplificando tarefas
		const add = () => {expression += char}
		const invert = (str) => {
			let newStr = '';
			for(let i = str.length - 1; i >= 0; i--) {
				newStr += str[i];
			}
			return newStr;
		}
		const testAddOpenP = () => {
			o = (expression.match(/\(/g) || []).length;
			c = (expression.match(/\)/g) || []).length;
			if (o > c) {return true}
			return false;
		}
		
		//0 A 9
		//testa se o ultimo digito é um número, +, -, *, /, (, )
		//e se char é um digito numerico
		if((lastDigit.test(expression) || lastPoint.test(expression) || lastOperati.test(expression))&& digit.test(char)) {add();}
		//PONTO .
		//testa se o ultimo número tem ponto, 
		//se não acrescenta um ponto caso char = '.'
		else if(char == '.' && !lastPoint.test(expression) 
		&& (numberInvert.test(invert(expression)) || numberOne.test(expression))) {add()}
		//+ - * / ( )
		//testa se ultimo digito é numero ou closeParenteses e se char é um desses + - * ...
		else if((lastDigit.test(expression) || expression[expression.length - 1] == ')') && operati.test(char)) {add()}
		//se char = ')' testa se ultimo digito é um numero ou )
		else if(char == ')' && (lastDigit.test(expression) || expression[expression.length - 1] == ')') && testAddOpenP()) {add()}
		//adicionar + - ou ( depois do (
		else if(expression[expression.length - 1] == '(' && firstChar.test(char)) {add()}
		//testa se ultimo caractere é + - * / para poder colocar o (
		else if(operatiPure.test(expression[expression.length - 1]) && char == '(') {add()}
	}
	//atualize o display
	updateDisplay('expression');
	//se o ultimo digito for um numero ou parenteses ')' atualize
	//o displayResult
	if(lastDigit.test(expression) || expression[expression.length - 1] == ')') {
		expressionEvaluate();
	}
}

//resolvendo calculos
function expressionEvaluate() {
	result = math.evaluate(expression)
	updateDisplay('result');
}

//função de atualização do display
//deve ser chamada somente quando ouver necessidade
function updateDisplay(part) {
	switch(part) {
		case 'result':
			displayResult.innerText = result;
		break;
		case 'expression':
			displayExpression.innerText = expression;
		break;
		default:
			result = null;
			displayResult.innerText = result;
			displayExpression.innerText = expression;
		break;
	}
}


//debugando

