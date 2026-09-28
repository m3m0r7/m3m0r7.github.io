import test from 'node:test';
import assert from 'node:assert/strict';
import {executeCommand} from '../js/terminal.mjs';
import {initialState} from '../js/state.mjs';
import {BOOKS} from '../js/documents.mjs';
const state=initialState();
test('コマンド本のファイル操作がファイルアプリと同じ資料を読む',()=>{
  let session={cwd:'/home/memory'};
  assert.match(executeCommand('lst',state,session).output,/住まい/);
  session.cwd=executeCommand('chgdir 住まい/設備・工事',state,session).cwd;
  assert.equal(executeCommand('crt',state,session).output,'/home/memory/住まい/設備・工事');
  const file='サーバー室施工契約書.rtx';
  assert.match(executeCommand(`read "${file}"`,state,session).output,/猫の誕生日とする/);
  assert.equal(executeCommand(`read "${file}"`,state,session).clue,'construction');
  assert.match(executeCommand(`grep 誕生日 "${file}"`,state,session).output,/第９条/);
  assert.doesNotMatch(executeCommand(`head -n 3 "${file}"`,state,session).output,/第９条/);
  assert.equal(executeCommand('chgdir ../..',state,session).cwd,'/home/memory');
  assert.match(executeCommand('find ~ -name *施工*',state).output,/サーバー室施工契約書/);
});
test('仮想ファイル操作が存在しないパスや不正な行数を拒否する',()=>{
  for(const path of ['/Users/kei/.ssh/id_rsa','/etc/passwd'])assert.match(executeCommand('read '+path,state).output,/そのファイルはありません/);
  assert.match(executeCommand('chgdir missing',state).output,/見つかりません/);
  assert.match(executeCommand('head -n -1 /etc/hostname',state).output,/行数/);
  assert.equal(executeCommand('head -n 0 /etc/hostname',state).output,'');
  assert.match(executeCommand('icfg; echo ok',state).output,/command not found/);
});
test('旧名と削除コマンドは別名として残らず、手引きにも表示しない',()=>{
  for(const input of ['ifconfig','ip route','ip a','ipconfig','route -n','ping 127.0.0.1','nslookup i.mem.ooo','dig i.mem.ooo','ls','pwd','cd ~','cat /etc/hostname','less /etc/hostname','tail /etc/hostname','dmesg | tail']){
    const result=executeCommand(input,state);assert.match(result.output,/command not found/,input);assert.equal(result.verifyInterface,undefined,input);
  }
  const guide=BOOKS.commands.pages.flat().join('\n')+executeCommand('help',state).output;
  assert.equal(BOOKS.commands.title,'memoryOSコマンドリファレンス');
  for(const word of ['icfg','irt','p','nlp','lst','crt','chgdir','read'])assert.match(executeCommand('man '+word,state).output,new RegExp('^'+word+'(?: |\\n)'));
  assert.doesNotMatch(guide,/\b(?:ifconfig|ipconfig|ping|nslookup|ls|pwd|cd|cat|less|tail|UNIX|Linux)\b/);
  assert.match(executeCommand('uname -a',state).output,/^memoryOS /);
});
