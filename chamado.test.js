const { test, beforeEach } = require('node:test');
const assert = require('node:assert');
const s = require('./chamado');

// Antes de cada teste: sistema limpo e um chamado pronto para encerrar
let chamado;
beforeEach(() => {
  s.resetar();
  chamado = s.abrirChamado('Projetor da sala 12 não liga', 'instrutor.teste');
  s.atribuir(chamado.id, 'tecnico.teste');
  s.iniciarAtendimento(chamado.id, 'tecnico.teste');
});

test('C1 · chamado inexistente lança ErroNaoEncontrado', () => {
  assert.throws(() => s.encerrar(999, 'tecnico.teste', 'Troquei o cabo'), s.ErroNaoEncontrado);
});

test('C5 · técnico atribuído encerra com solução', () => {
  const c = s.encerrar(chamado.id, 'tecnico.teste', 'Troquei o cabo HDMI');
  assert.strictEqual(c.status, s.STATUS.ENCERRADO);
});

// TODO C2 · técnico que não é o atribuído
test('C2 · técnico não atribuído lança ErroAcessoNegado', () => {
  assert.throws(
    () => s.encerrar(chamado.id, 'tecnico2.teste', 'Troquei o cabo'),
    s.ErroAcessoNegado
  );
});
// TODO C3 · solução em branco
// TODO C4 · chamado que não está em atendimento
