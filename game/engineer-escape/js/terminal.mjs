import { executeFileCommand } from './shell-files.mjs';
import { hasLink, isOnline } from './state.mjs';
export function executeCommand(input, state, session = {}) {
  const local=executeFileCommand(input,state,session);if(local)return local;
  const command = input.trim().replace(/\s+/g, ' ').toLowerCase();
  const link = hasLink(state), ip = link && state.autoIP;
  if (!command) return { output: '' };
  if (command === 'clear') return { clear: true };
  if (['help', '?'].includes(command)) return { output: '利用できるコマンド:\n  lst, crt, chgdir, read, more, head, grep, find\n  icfg, irt, p, nlp, dhclient\n  dmesg, journalctl, curl, hostname, whoami, uname\n  date, echo, man, history, clear' };
  if (/^icfg(?: (?:eth0|-a))?$/.test(command)) return { clue: 'dhcp', verifyInterface: isOnline(state), output: `eth0: flags=${link ? '4163<UP,BROADCAST,RUNNING,MULTICAST>' : '4099<UP,BROADCAST,MULTICAST>'}  mtu 1500\n${ip ? '        inet 192.168.10.24  netmask 255.255.255.0  broadcast 192.168.10.255\n' : ''}        ether 02:00:00:00:10:24  txqueuelen 1000  (Ethernet)\n        RX packets ${link ? '138' : '0'}  bytes ${link ? '18924' : '0'}\n        TX packets ${link ? '102' : '0'}  bytes ${link ? '14280' : '0'}\n        carrier ${link ? '1' : '0'}  link ${link ? 'detected' : 'not detected'}` };
  if (command === 'irt') return { output: ip ? 'default via 192.168.10.1 dev eth0 proto dhcp\n192.168.10.0/24 dev eth0 proto kernel src 192.168.10.24' : '' };
  if (['dhclient', 'sudo dhclient'].includes(command)) return { clue: 'dhcp', output: !link ? 'eth0: no carrier\nNo DHCPOFFERS received.' : !state.autoIP ? 'eth0: DHCP client disabled' : 'DHCPDISCOVER on eth0\nDHCPOFFER from 192.168.10.1\nDHCPREQUEST for 192.168.10.24\nDHCPACK from 192.168.10.1\nbound to 192.168.10.24 -- renewal in 43200 seconds.' };
  if (/^p(?: -c [1-9])? \S+$/.test(command)) {
    const host = command.split(' ').at(-1);
    if (['localhost', '127.0.0.1'].includes(host)) return { output: 'P localhost (127.0.0.1) 56(84) bytes of data.\n64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.031 ms\n1 packets transmitted, 1 received, 0% packet loss' };
    if (!ip) return { output: 'p: connect: Network is unreachable' };
    const domain = !/^\d+\.\d+\.\d+\.\d+$/.test(host);
    if (domain && (!state.autoDNS || host !== 'i.mem.ooo')) return { output: `p: ${host}: Temporary failure in name resolution` };
    if (!['192.168.10.1', '192.168.10.24', '203.0.113.24', 'i.mem.ooo'].includes(host)) return { output: `P ${host}\n3 packets transmitted, 0 received, 100% packet loss` };
    const address = host === 'i.mem.ooo' ? '203.0.113.24' : host;
    return { output: `P ${host} (${address}) 56(84) bytes of data.\n64 bytes from ${address}: icmp_seq=1 ttl=64 time=0.842 ms\n64 bytes from ${address}: icmp_seq=2 ttl=64 time=0.796 ms\n2 packets transmitted, 2 received, 0% packet loss` };
  }
  if (/^nlp( \S+)?$/.test(command)) return { clue: 'dns', output: !ip ? ';; communications error: network unreachable\n;; no servers could be reached' : !state.autoDNS ? ';; no servers could be reached' : command.split(' ')[1] !== 'i.mem.ooo' ? '** server cannot find host: NXDOMAIN' : 'Server: 192.168.10.1\nAddress: 192.168.10.1#53\n\nName: i.mem.ooo\nAddress: 203.0.113.24' };
  if (['dmesg', 'journalctl', 'journalctl -xe', 'journalctl -u networkmanager', 'logs'].includes(command)) return { output: `[  14.280006] memnic eth0: NIC Link is Down\n[  14.280007] memoryOS NetworkService: carrier lost\n[  14.280008] dhcp4 (eth0): state changed bound -> expire${state.cableReplaced ? `\n[  24.350001] memnic eth0: NIC Link is ${link ? 'Up 1000 Mbps Full Duplex' : 'Down'}\n[  24.350002] dhcp4 (eth0): ${ip ? 'address=192.168.10.24' : 'waiting'}` : ''}` };
  if (command === 'hostname') return { output: 'memory-home' };
  if (command.startsWith('curl ')) return { output: isOnline(state) && /(?:https?:\/\/)?i\.mem\.ooo\/?$/.test(command) ? 'HTTP/1.1 200 OK\n\n<h1>hello, world.</h1>' : !ip ? 'curl: (7) Failed to connect: Network is unreachable' : 'curl: (6) Could not resolve host' };
  return { output: `memoryOS: ${command.split(' ')[0]}: command not found` };
}
