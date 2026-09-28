import test from 'node:test';
import assert from 'node:assert/strict';
import { terminalPrompt,commandTranscript } from '../js/terminal-view.mjs';
import { executeCommand } from '../js/terminal.mjs';
import { initialState } from '../js/state.mjs';

test('送信済みのコマンドは入力時と同じプロンプト・空白で残る',()=>{
  const cwd='/home/memory/住まい/設備・工事';
  const result=executeCommand('chgdir ../..',initialState(),{cwd});
  assert.equal(result.cwd,'/home/memory');
  assert.equal(commandTranscript(cwd,'chgdir ../..',result.output),terminalPrompt(cwd)+' chgdir ../..');
  assert.equal(terminalPrompt(result.cwd),'memory@home:~ $');
  assert.equal(commandTranscript('/etc','crt','/etc'),'memory@home:/etc $ crt\n/etc');
  assert.equal(terminalPrompt('/home/memory2'),'memory@home:/home/memory2 $');
});
