const btnMobile = document.getElementById('btn-mobile');
const formulario = document.getElementById('formulario');

function toggleMenu(event) {
    if (event.type === 'touchstart') event.preventDefault();
    const nav = document.getElementById('nav');
    
    nav.classList.toggle('active');
    const active = nav.classList.contains('active');
    
    event.currentTarget.setAttribute('aria-expended', active);
    if (active) {
        event.currentTarget.setAttribute('aria-label', 'Fechar menu')
    } else {
        event.currentTarget.setAttribute('aria-label', 'Abrir menu')
    }
}

/*
    -Calcula o valor de contribuição do INSS do colaborador com base na tabela progressiva;
    -Referência: Tabela INSS 2025 - Salário mínimo R$ 1.518,00.
*/
function calcularInss() {

    const tetoInss = 8157.41; //Teto da tabela do INSS que definirá o máximo a ser descontado.
    let inssADescontar;

    //Leitura e preparação do salário bruto.
    let salarioBruto = parseFloat(document.getElementById('salario-bruto').value);
    salarioBruto *= 1000;

    //Lógica do cálculo simplificada.
    if (salarioBruto <= 1518) {
        inssADescontar = salarioBruto * 0.075;
    } else if (salarioBruto <= 2793.88) {
        inssADescontar = (salarioBruto * 0.09) - 22.77;
    } else if (salarioBruto <= 4190.83) {
        inssADescontar = (salarioBruto * 0.12) - 106.59;
    } else if (salarioBruto <= tetoInss) {
        inssADescontar = (salarioBruto * 0.14) - 190.40;
    } else {
        inssADescontar = 951.64; //Valor máximo com base no teto de contribuição.
    }

    return parseFloat(inssADescontar.toFixed(2));
}

/*
    -Calcula o valor de contribuição do IRRF do colaborador com base na tabela progressiva;
    -Referência: Medida Provisória 1.294/2025 - Valor por dependenre R$ 189,59.
*/

function calcularIrrf() {

    //Variáveis diversas
    const valorDependente = 189.59;
    const limiteIsencaoMes = 10.00;
    let irrfADescontar;

    //Leitura do valor do salario bruto e dependentes.
    let salarioBruto = parseFloat(document.getElementById('salario-bruto').value);
    salarioBruto *= 1000;

    const dependentes = document.getElementById('dependentes').value;

    //Expressões para Base de Cálculo do imposto.
    const deducaoDependenteIrrf = dependentes * valorDependente;
    const baseIrrf = salarioBruto - calcularInss() - deducaoDependenteIrrf;

    //Lógica do cálculo de IRRF
    if (baseIrrf <= 2428.80) {
        irrfADescontar = 0;
    } else if (baseIrrf <= 2826.65) {
        // Se valor de IRRF for menor que R$ 10,00, contribuinte fica isento do desconto naquele mês (Artigo 67 da Lei nº 9.430/1996).
        let irrfCalculado = (baseIrrf * 0.075) - 169.44;

        if (irrfCalculado < limiteIsencaoMes) { // Deve ser menor que R$ 10,00.
            irrfADescontar = 0;
        } else {
            irrfADescontar = irrfCalculado;
        }
    } else if ( baseIrrf <= 3751.05) {
        irrfADescontar = (baseIrrf * 0.15) - 394.16;
    } else if (baseIrrf <= 4664.68) {
        irrfADescontar = (baseIrrf * 0.225) - 675.49;
    } else {
        irrfADescontar = (baseIrrf * 0.275) - 908.73;       
    }

    return parseFloat(irrfADescontar.toFixed(2));
}

formulario.addEventListener('submit', event => {
    event.preventDefault();
    window.scrollBy(0, 200);

    // CAPTAÇÃO DE DADOS DO FORMULÁRIO
    const salario = document.getElementById('salario-bruto').value;
    const descontos = document.getElementById('descontos').value;
    const salarioBruto = parseFloat(salario);  
    
    //REMOVE "ESCONDIDO" DA TABELA
    document.getElementById('resultado-container').classList.remove('hidden');

    document.getElementById('img').classList.add('hidden');

    // CÁLCULOS: TOTAL DE DESCONTOS, VALOR LÍQUIDO, Percentual sobre INSS E IRRF
    /*const aliquotaInss = (calcularInss() / salarioBruto) / 10;
    const aliquotaIrrf = (calcularIrrf() / salarioBruto) / 10;*/
    const totalDescontos = parseFloat(descontos) + calcularInss() + calcularIrrf();

    function calcularLiquido() {
        let salarioBruto = parseFloat(document.getElementById('salario-bruto').value);
        salarioBruto *= 1000;
    
        return salarioBruto - totalDescontos;
    }

    // INCLUSÃO DE INFORMAÇÕES NA TABELA
    document.getElementById('salario').textContent = (salarioBruto * 1000).toLocaleString('pt-br', {minimumFractionDigits: 2});

    document.getElementById('total-proventos').textContent = (salarioBruto * 1000).toLocaleString('pt-br', {minimumFractionDigits: 2});
    /*document.getElementById('tabela-descontos').textContent = parseFloat(descontos).toLocaleString('pt-br', {minimumFractionDigits: 2});*/
    
    document.getElementById('total-descontos').textContent = totalDescontos.toLocaleString('pt-br', {minimumFractionDigits: 2});

    /*document.getElementById('aliquota-inss').textContent = aliquotaInss.toFixed(2).replace('.', ',') + '%';*/
    document.getElementById('valor-inss').textContent = calcularInss().toLocaleString('pt-br', {minimumFractionDigits: 2});
    
    /*document.getElementById('aliquota-irrf').textContent = aliquotaIrrf.toFixed(2).replace('.', ',') + '%';*/
    document.getElementById('valor-irrf').textContent = calcularIrrf().toLocaleString('pt-br', {minimumFractionDigits: 2});
    
    document.getElementById('liquido-pagar').textContent = calcularLiquido().toLocaleString('pt-br', {minimumFractionDigits: 2});
    
}
)

btnMobile.addEventListener('click', toggleMenu);
btnMobile.addEventListener('touchstart', toggleMenu);
