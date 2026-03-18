const TOTAL_PERGUNTAS = 6;
const URL_PLANILHA = 'https://script.google.com/macros/s/AKfycbxtCQCdSwDJQQCvvciC1fTMSEuWzcKXSuwSFAXrIxJMswWC_6IT9CM2Ym6luZSOL-gHoA/exec';

const TEXTOS_RESPOSTAS = {
    p1: {
        a: 'Ainda estou começando (menos de 6 meses)',
        b: 'Já tenho um tempinho (6 meses a 2 anos)',
        c: 'Estou no mercado há mais de 2 anos'
    },
    p2: {
        a: 'Não tenho nada definido ainda — uso o que dá',
        b: 'Tenho alguma coisa, mas foi feita no improviso',
        c: 'Tenho logo e cores, mas sinto que não representa minha marca'
    },
    p3: {
        a: 'Instagram ou outras redes sociais',
        b: 'WhatsApp e indicações',
        c: 'Loja física ou site'
    },
    p4: {
        a: 'As pessoas nem sabem que meu negócio existe',
        b: 'As pessoas me acham, mas não entendem o que eu faço ou porque me contratar',
        c: 'As pessoas me seguem, mas não compram — e eu não sei por quê'
    },
    p5: {
        a: 'Nunca investi, sempre fiz tudo sozinha intuitivamente',
        b: 'Já contratei alguém para resolver, mas não obtive resultados',
        c: 'Já investi em cursos para resolver meu problema, mas não adiantou'
    },
    p6: {
        a: 'Criar uma marca do zero, que pareça profissional',
        b: 'Entender o que tá errado na minha marca atual e como corrigir',
        c: 'Ter um visual consistente nas redes e parar de improvisar conteúdo'
    }
};

const NOMES_RESULTADO = {
    a: 'Marca Invisível',
    b: 'Marca Confusa (desalinhada)',
    c: 'Marca Confusa (tem base)'
};

function iniciarQuiz() {
    document.querySelector('.tela-home').style.display = 'none';
    document.querySelector('.tela-form').style.display = 'block';
}

function voltarHome() {
    document.querySelector('.tela-form').style.display = 'none';
    document.querySelector('.tela-home').style.display = 'block';
}

function iniciarPerguntas() {
    const nome = document.getElementById('nome').value.trim();
    const marca = document.getElementById('marca').value.trim();
    const instagram = document.getElementById('instagram').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const aceite = document.querySelector('input[name="aceite"]').checked;

    if (!nome || !marca || !instagram || !whatsapp || !aceite) {
        document.getElementById('aviso-form').style.display = 'block';
        return;
    }

    document.getElementById('aviso-form').style.display = 'none';
    document.querySelector('.tela-form').style.display = 'none';
    document.querySelector('.tela-perguntas').style.display = 'block';
    atualizarProgresso(1);
    mostrarPergunta(1);
}

function atualizarProgresso(numero) {
    const porcentagem = (numero / TOTAL_PERGUNTAS) * 100;
    document.getElementById('progressFill').style.width = porcentagem + '%';
    document.getElementById('progressLabel').textContent = numero;
    document.getElementById('progressCurrent').textContent = numero;
}

function mostrarPergunta(numero) {
    document.querySelectorAll('.pergunta').forEach(p => p.style.display = 'none');
    const pergunta = document.getElementById('pergunta-' + numero);
    if (pergunta) pergunta.style.display = 'block';
}

function proximaPergunta(numero) {
    const perguntaAtual = numero - 1;
    const selecionado = document.querySelector(`input[name="p${perguntaAtual}"]:checked`);

    if (!selecionado) {
        const pergunta = document.getElementById('pergunta-' + perguntaAtual);
        const aviso = pergunta.querySelector('.aviso');
        if (aviso) aviso.style.display = 'block';
        return;
    }

    atualizarProgresso(numero);
    mostrarPergunta(numero);
}

function finalizarQuiz() {
    const selecionado = document.querySelector('input[name="p6"]:checked');

    if (!selecionado) {
        const pergunta = document.getElementById('pergunta-6');
        const aviso = pergunta.querySelector('.aviso');
        if (aviso) aviso.style.display = 'block';
        return;
    }

    const contagem = { a: 0, b: 0, c: 0 };
    const respostas = {};

    for (let i = 1; i <= TOTAL_PERGUNTAS; i++) {
        const resposta = document.querySelector(`input[name="p${i}"]:checked`);
        if (resposta) {
            contagem[resposta.value]++;
            respostas[`p${i}`] = TEXTOS_RESPOSTAS[`p${i}`][resposta.value];
        }
    }

    let resultado;
    if (contagem.a >= contagem.b && contagem.a >= contagem.c) {
        resultado = 'a';
    } else if (contagem.b >= contagem.c) {
        resultado = 'b';
    } else {
        resultado = 'c';
    }

    fetch(URL_PLANILHA, {
        method: 'POST',
        body: JSON.stringify({
            nome: document.getElementById('nome').value,
            marca: document.getElementById('marca').value,
            instagram: document.getElementById('instagram').value,
            whatsapp: document.getElementById('whatsapp').value,
            resultado: NOMES_RESULTADO[resultado],
            p1: respostas.p1,
            p2: respostas.p2,
            p3: respostas.p3,
            p4: respostas.p4,
            p5: respostas.p5,
            p6: respostas.p6
        })
    });

    document.querySelector('.tela-perguntas').style.display = 'none';
    document.querySelector('.tela-resultado').style.display = 'block';
    document.getElementById('resultado-' + resultado).style.display = 'block';
}

function refazerQuiz() {
    document.querySelector('.tela-resultado').style.display = 'none';
    document.querySelectorAll('.resultado').forEach(r => r.style.display = 'none');
    document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
    document.querySelectorAll('.aviso').forEach(a => a.style.display = 'none');
    document.querySelector('.tela-home').style.display = 'block';
}
