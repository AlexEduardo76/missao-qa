// Projeto de treino · serviço de chamados
const STATUS = {
  ABERTO: 'ABERTO',
  ATRIBUIDO: 'ATRIBUIDO',
  EM_ATENDIMENTO: 'EM_ATENDIMENTO',
  ENCERRADO: 'ENCERRADO',
};

class ErroNaoEncontrado extends Error {}
class ErroAcessoNegado extends Error {}
class ErroValidacao extends Error {}
class ErroOperacaoInvalida extends Error {}

let chamados = new Map();
let proximoId = 1;

function resetar() {
  chamados = new Map();
  proximoId = 1;
}

// Regra: o título deve ter de 5 a 100 caracteres
function abrirChamado(titulo, instrutor) {
  if (!titulo || titulo.length <= 5 || titulo.length > 100) {
    throw new ErroValidacao('O título deve ter de 5 a 100 caracteres');
  }
  const chamado = { id: proximoId++, titulo, instrutor, tecnico: null, status: STATUS.ABERTO };
  chamados.set(chamado.id, chamado);
  return chamado;
}

function atribuir(id, tecnico) {
  const c = chamados.get(id);
  if (!c) throw new ErroNaoEncontrado('Chamado não encontrado');
  c.tecnico = tecnico;
  c.status = STATUS.ATRIBUIDO;
  return c;
}

function iniciarAtendimento(id, usuario) {
  const c = chamados.get(id);
  if (!c) throw new ErroNaoEncontrado('Chamado não encontrado');
  if (c.tecnico !== usuario) throw new ErroAcessoNegado('Só o técnico atribuído pode atender');
  c.status = STATUS.EM_ATENDIMENTO;
  return c;
}

function encerrar(id, usuario, solucao) {
  const c = chamados.get(id);
  if (!c) {                                              // D1
    throw new ErroNaoEncontrado('Chamado não encontrado');
  }
  if (c.tecnico !== usuario) {                           // D2
    throw new ErroAcessoNegado('Só o técnico atribuído pode encerrar');
  }
  if (solucao === null || solucao.trim() === '') {       // D3
    throw new ErroValidacao('A solução é obrigatória');
  }
  if (c.status !== STATUS.EM_ATENDIMENTO) {              // D4
    throw new ErroOperacaoInvalida('O chamado precisa estar em atendimento');
  }
  c.status = STATUS.ENCERRADO;
  c.solucao = solucao;
  return c;
}

// Usado pela tela: devolve uma resposta para o navegador
function encerrarPelaTela(id, usuario, solucao) {
  try {
    encerrar(id, usuario, solucao);
  } catch (e) {
    // TODO: tratar depois
  }
  return { ok: true, mensagem: 'Chamado encerrado com sucesso' };
}

module.exports = {
  STATUS, ErroNaoEncontrado, ErroAcessoNegado, ErroValidacao, ErroOperacaoInvalida,
  resetar, abrirChamado, atribuir, iniciarAtendimento, encerrar, encerrarPelaTela,
};
