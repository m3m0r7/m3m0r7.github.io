import { TASK_IDS } from './todo-documents.mjs';
import { isCableExtracted } from './supply-search.mjs';
import { EXTRA_INSPECTIONS } from './exploration.mjs';
import { debugZone } from './debug-sequence.mjs';
export const STORAGE_KEY = 'engineer-escape:stage1:v3';
export const CLUES = ['power', 'modem', 'invoice', 'book', 'command-book', 'connector', 'damage', 'dhcp', 'dns', 'birthday', 'adoption', 'construction', 'door', ...Object.keys(EXTRA_INSPECTIONS)];
export const CAT_CODES = Object.freeze({ eru: '0619', guri: '1228' });
export const SERVER_CODE = CAT_CODES.eru + CAT_CODES.guri;
export const CIRCUITS = Object.freeze(['living', 'kitchen', 'equipment']);
export function initialState() {
  return { version: 3, introSeen: false, taskChecks: {}, clues: [], drawerOpen: false, nightstandOpen: false, boxOpen: false, keyTaken: false, testerTaken: false, usbTaken: false, keyInserted: false, codeAccepted: false, cablesOnBench: false, spareTaken: false, cableReplaced: false, pcConnected: true, routerConnected: true, powerOn: true, modemOn: true, autoIP: true, autoDNS: true, circuits: { living: true, kitchen: true, equipment: true }, interfaceVerified: false, completed: false, gameOver: false, elapsed: 0 };
}
export const serverOpen = state => state.keyInserted && state.codeAccepted;
export const pcPowered = state => state.powerOn && state.circuits.living && !state.gameOver;
export const hasLink = state => pcPowered(state) && state.modemOn && state.cableReplaced && state.pcConnected && state.routerConnected;
export const isOnline = state => hasLink(state) && state.autoIP && state.autoDNS;
export function inventory(state) {
  return [state.keyTaken && !state.keyInserted && 'key', state.testerTaken && 'tester', state.usbTaken && 'usb', state.spareTaken && !state.cableReplaced && 'cable', state.cableReplaced && 'broken'].filter(Boolean);
}
export function transition(state, action) {
  if (state.gameOver) return state;
  const next = { ...state, clues: [...state.clues], circuits: { ...state.circuits } };
  switch (action.type) {
    case 'TASK_CHECK':
      if(TASK_IDS.has(action.id)&&typeof action.checked==='boolean')next.taskChecks={...state.taskChecks,[action.id]:action.checked};
      break;
    case 'INTRO': next.introSeen = true; break;
    case 'CLUE': if (CLUES.includes(action.id) && !next.clues.includes(action.id)) next.clues.push(action.id); break;
    case 'DRAWER': next.drawerOpen = true; break;
    case 'CHEST': if (typeof action.open === 'boolean') next.nightstandOpen = action.open; break;
    case 'BOX': if (typeof action.open === 'boolean') next.boxOpen = action.open; break;
    case 'TAKE_KEY': if (next.nightstandOpen) next.keyTaken = true; break;
    case 'TAKE_TESTER': if (next.drawerOpen) next.testerTaken = true; break;
    case 'TAKE_USB': if (serverOpen(next)) next.usbTaken = true; break;
    case 'INSERT_KEY': if (next.keyTaken) next.keyInserted = true; break;
    case 'CODE': if (action.code === SERVER_CODE) next.codeAccepted = true; break;
    case 'STAGE_CABLES': if (serverOpen(next)) next.cablesOnBench = true; break;
    case 'TAKE_CABLE': if (serverOpen(next) && next.cablesOnBench && isCableExtracted(action.extraction)) next.spareTaken = true; break;
    case 'REPLACE': if (inventory(next).includes('cable')) { next.cableReplaced = true; next.pcConnected = true; next.routerConnected = true; } break;
    case 'CONNECTOR': if (['pc','router'].includes(action.side) && typeof action.connected === 'boolean') next[`${action.side}Connected`] = action.connected; break;
    case 'POWER': if (typeof action.on === 'boolean') next.powerOn = action.on; break;
    case 'MODEM': if (typeof action.on === 'boolean') next.modemOn = action.on; break;
    case 'BREAKER':
      if (CIRCUITS.includes(action.circuit) && typeof action.on === 'boolean') next.circuits[action.circuit] = action.on;
      if (CIRCUITS.every(id => !next.circuits[id])) { next.gameOver = true; next.completed = false; next.interfaceVerified = false; }
      break;
    case 'SETTINGS':
      if (typeof action.autoIP === 'boolean' && typeof action.autoDNS === 'boolean') { next.autoIP = action.autoIP; next.autoDNS = action.autoDNS; }
      break;
    case 'TICK': if (!next.completed) next.elapsed += 1; break;
    case 'VERIFY_INTERFACE': if (isOnline(next)) { next.interfaceVerified = true; next.completed = true; } break;
    case 'DEBUG_UNLOCK':
      if(debugZone(action.position)!=='toilet')return state;
      Object.assign(next,{keyTaken:true,keyInserted:true,codeAccepted:true});break;
    case 'DEBUG_CLEAR':
      if(debugZone(action.position)!=='bath')return state;
      Object.assign(next,{introSeen:true,keyTaken:true,keyInserted:true,codeAccepted:true,cablesOnBench:true,spareTaken:true,cableReplaced:true,pcConnected:true,routerConnected:true,powerOn:true,modemOn:true,autoIP:true,autoDNS:true,interfaceVerified:true,completed:true});
      next.circuits={living:true,kitchen:true,equipment:true};break;
    default: return state;
  }
  return next;
}
export function hydrate(value) {
  if (!value || value.version !== 3) return null;
  const state = initialState();
  for (const key of Object.keys(state)) if (typeof state[key] === 'boolean') {
    // 作業台導入前の v3 セーブは取得済みの場合のみ搬送済みとして読む。
    if (key === 'cablesOnBench' && !Object.hasOwn(value, key)) { state[key] = value.spareTaken === true; continue; }
    if (typeof value[key] !== 'boolean') return null;
    state[key] = value[key];
  }
  if(Object.hasOwn(value,'taskChecks')){
    if(!value.taskChecks||typeof value.taskChecks!=='object'||Array.isArray(value.taskChecks)||Object.entries(value.taskChecks).some(([id,checked])=>!TASK_IDS.has(id)||typeof checked!=='boolean'))return null;
    state.taskChecks={...value.taskChecks};
  }
  if (!value.circuits || CIRCUITS.some(id => typeof value.circuits[id] !== 'boolean')) return null;
  state.circuits = Object.fromEntries(CIRCUITS.map(id => [id, value.circuits[id]]));
  if (!Array.isArray(value.clues) || value.clues.some(clue => !CLUES.includes(clue))) return null;
  if (!Number.isSafeInteger(value.elapsed) || value.elapsed < 0) return null;
  state.elapsed = value.elapsed; state.clues = [...new Set(value.clues)];
  if ((state.testerTaken && !state.drawerOpen) || (state.keyInserted && !state.keyTaken) || ((state.cablesOnBench || state.spareTaken || state.usbTaken) && !serverOpen(state)) || (state.spareTaken && !state.cablesOnBench) || (state.cableReplaced && !state.spareTaken) || (state.completed !== state.interfaceVerified) || (state.completed && (!state.cableReplaced || state.gameOver)) || (state.gameOver !== CIRCUITS.every(id => !state.circuits[id]))) return null;
  return state;
}
export function readSave() {
  let raw;
  try { raw = localStorage.getItem(STORAGE_KEY); }
  catch { return { state: initialState(), status: 'unavailable' }; }
  if (!raw) return { state: initialState(), status: 'ready' };
  try { const state = hydrate(JSON.parse(raw)); return { state: state || initialState(), status: state ? 'loaded' : 'invalid' }; }
  catch { return { state: initialState(), status: 'invalid' }; }
}
export function writeSave(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); return true; }
  catch { return false; }
}
