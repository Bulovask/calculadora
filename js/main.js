//dedico esse código à Nossa Senhora

//PRIMEIRA PARTE: &PARTE1
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
times.ondblclick= () => {
	if(expression[expression.length - 1] == '*') {
		expression = expression.slice(0, expression.length - 1);
	}
	addCharExpression('^');
}
divided.onclick = () => {addCharExpression('/')}
equal.onclick   = expressionEvaluate;
equal.ondblclick= upResultToExpression;
//clicando nas teclas do controle de manipulação
deleted.onclick = () => {
	//testa se tem result estar preenchido
	//Apaga o result
	if(result != null) {
		result = null;
		updateDisplay('result');
	}
	//Testa se expression é NaN ou ±Infinity
	//Apaga NaN ou Infinity
	else if((isNaN(expression) && typeof expression == 'number') || expression == Infinity || expression == -Infinity) {
		expression = null
		updateDisplay('result expression');
	}
	//Apaga o ultimo digito
	else if(expression.length > 0) {
		expression = expression.substring(0,expression.length - 1) || null;
		updateDisplay('result expression');
	}
}
clear.onclick   = () => {expression = null; result = null; updateDisplay('result expression')}
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
const numberInvert = /^\d+[\+\-\*\/\(/)\^]/;
const lastOperati  = /[\+\-\*\/\(\)\^]$/;
const operati      = /[\+\-\*\/\(\^]/;
const operatiPure  = /[\+\-\*\/\^]/;
const iszero    = /[\+\-\*\/\(\)\^]0$/;

//Função executada quando o usuario interage com os botões
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
		//tamanho inicial da expressão
		const initLengthExpr = expression.length
		//SIMPLIFICANDO TAREFAS
		const add = () => {expression += char}
		//retorna uma string com a expression invertida
		const invert = (str) => {
			let newStr = '';
			for(let i = str.length - 1; i >= 0; i--) {
				newStr += str[i];
			}
			return newStr;
		}
		//Testa se tem parenteses abertos
		const testAddOpenP = () => {
			o = (expression.match(/\(/g) || []).length;
			c = (expression.match(/\)/g) || []).length;
			if (o > c) {return true}
			return false;
		}
		//Testa se a expressao está englobada entre parenteses
		const testEncompassedExpression = () => {
			if(expression[0] == '(' && expression[expression.length - 1] == ')') {
				let n = 0;
				for(let l = 0; l < expression.length; l++) {
					ch = expression[l];
					if(ch == '(') n++;
					else if(ch == ')') n--;
					if(n == 0 && l != expression.length - 1) {
						return false;
					}
				}
				return true;
			}
		}
		//testa se o primeiro digito depois de: +, -, *, /, (, ) é 0
		//testa se char é digito numerico
		if((iszero.test(expression) || expression == '0') && digit.test(char)) {
			expression = expression.slice(0, expression.length - 1);
			add();
		}
		//0 A 9
		//testa se o ultimo digito é um número, +, -, *, /, (, )
		//e se char é um digito numerico
		else if((lastDigit.test(expression) || lastPoint.test(expression) || lastOperati.test(expression))&& digit.test(char)) {add();}
		//PONTO .
		//testa se o ultimo número tem ponto, 
		//se não acrescenta um ponto caso char = '.'
		else if(char == '.' && !lastPoint.test(expression) 
		&& (numberInvert.test(invert(expression)) || numberOne.test(expression))) {add()}
		//+ - * / ( )
		//testa se ultimo digito é numero ou closeParenteses e se char é um desses + - * ...
		else if((lastDigit.test(expression) || expression[expression.length - 1] == ')') && operati.test(char)) {add()}
		//se char = ')' testa se ultimo digito é um numero ou ) e se o numero de '(' é menor que o numero de ')', se sim então acrescente no final
		else if(char == ')' && (lastDigit.test(expression) || expression[expression.length - 1] == ')') && testAddOpenP()) {add()}
		//Englobar expressão inteira entre parenteses se char for ')' e o numero de '(' for igual ')' e o ultimo digito for numerico ou ')'
		else if(char == ')' && (lastDigit.test(expression) || expression[expression.length - 1] == ')') && !testAddOpenP()) {
			//Testa se a expressão não está englobada por parenteses
			if(!testEncompassedExpression()) {
				expression = '(' + expression + ')';
			}
		}
		//adicionar + - ou ( depois do (
		else if(expression[expression.length - 1] == '(' && firstChar.test(char)) {add()}
		//testa se ultimo caractere é + - * / para poder colocar o (
		else if(operatiPure.test(expression[expression.length - 1]) && char == '(') {add()}
		
		//Testa se tamanho inicial da expressão é menor que tamanho final
		//Se sim então resete o displayResult
		if(initLengthExpr < expression.length) {
			result = null
			updateDisplay('result');
		}
	}
	//atualize o display
	updateDisplay('expression');
}

//SEGUNDA PARTE: &PARTE2
//resolvendo calculos
function expressionEvaluate() {
	result = math.evaluate(expression)
	updateDisplay('result');
}

//Função para subir o result para expression
function upResultToExpression() {
	if(result != null) {
		expression = result;
		result = null
		updateDisplay('result expression');
	}
}

//função para formatar o expression para uma melhor visualização
function formatExpression() {
	if(expression != null){
		return String(expression).replace(/\*/g, '×').replace(/\//g, '÷').replace(/Infinity/g, '∞')
	}
	return '';
		
}

//função para formatar o result para uma melhor visualização
function formatResult() {
	if(result != null){
		return String(result).replace('Infinity', '∞')
	}
	return '';
		
}

//função de atualização do display
//deve ser chamada somente quando houver necessidade
function updateDisplay(part) {
	switch(part) {
		case 'result':
			displayResult.innerText = formatResult();
		break;
		case 'expression':
			displayExpression.innerText = formatExpression();
		break;
		default:
			result = null;
			displayResult.innerText = formatResult();
			displayExpression.innerText = formatExpression();
		break;
	}
}

//Inserindo um zero inicial
addCharExpression('0')

//Executo para retirar o delay, parece que
//math.evaluate em sua primeira execução apresenta
//um delay consideravel, para resolver isso se executa uma vez
math.evaluate('0')