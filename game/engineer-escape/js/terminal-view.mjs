export function terminalPrompt(cwd){
  const home='/home/memory',path=cwd===home?'~':cwd.startsWith(home+'/')?'~'+cwd.slice(home.length):cwd;
  return `memory@home:${path} $`;
}
export function commandTranscript(cwd,input,output){
  return `${terminalPrompt(cwd)} ${input}${output?'\n'+output:''}`;
}
