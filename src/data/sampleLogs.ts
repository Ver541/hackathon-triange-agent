export interface SampleLog {
  id: string;
  name: string;
  category: string;
  expectedSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';
  benchmarkRule: string;
  rawLog: string;
  description: string;
}

export const SAMPLE_LOGS: SampleLog[] = [
  {
    id: 'cic-smb-attempt',
    name: 'SMB Attempt · Port 445 Probe',
    category: 'Lateral Movement / Port Probe',
    expectedSeverity: 'HIGH',
    benchmarkRule: 'Unusual destination ports with high byte count / unanswered probe -> Potential Exfiltration or Brute Force',
    description: 'Suspicious SMB probing on port 445 from 192.168.10.5 to 192.168.10.14 with 5 forward packets and 0 backward responses.',
    rawLog: `[FlowID: 192.168.10.5-192.168.10.14-80-443-6] Src IP: 192.168.10.5, Dst IP: 192.168.10.14, Src Port: 54210, Dst Port: 445, Protocol: TCP, Flow Duration: 1200, TotFwdPkts: 5, TotBwdPkts: 0, Label: SMB_Attempt`
  },
  {
    id: 'cic-portscan-syn',
    name: 'PortScan · High-Rate SYN Burst',
    category: 'Port Scan / DoS',
    expectedSeverity: 'CRITICAL',
    benchmarkRule: 'High frequency SYN packets / short flow duration -> Port Scan / DoS (Critical)',
    description: 'Rapid TCP SYN sweep across destination ports with microsecond flow duration and zero backward response.',
    rawLog: `Flow ID: 172.16.0.1-192.168.10.50-49210-80-6
Source IP: 172.16.0.1
Source Port: 49210
Destination IP: 192.168.10.50
Destination Port: 80
Protocol: 6 (TCP)
Timestamp: 07/07/2017 09:12:44
Flow Duration: 48
Total Fwd Packets: 2
Total Backward Packets: 0
Total Length of Fwd Packets: 48
Total Length of Bwd Packets: 0
Fwd Packet Length Max: 24
Fwd Packet Length Min: 24
Fwd Packet Length Mean: 24.0
Flow Bytes/s: 1000000.0
Flow Packets/s: 41666.67
Flow IAT Mean: 48.0
Flow IAT Max: 48
Fwd IAT Mean: 48.0
SYN Flag Count: 2
RST Flag Count: 0
PSH Flag Count: 0
ACK Flag Count: 0
FIN Flag Count: 0
Down/Up Ratio: 0
Average Packet Size: 24.0
Subflow Fwd Packets: 2
Subflow Fwd Bytes: 48
Init_Win_bytes_forward: 1024
Init_Win_bytes_backward: 0`
  },
  {
    id: 'cic-benign-https',
    name: 'BENIGN · Standard HTTPS Flow',
    category: 'Normal Web Traffic',
    expectedSeverity: 'INFORMATIONAL',
    benchmarkRule: 'Standard web traffic (Port 80/443) with normal payload -> Benign',
    description: 'Legitimate TLS 1.3 encrypted HTTPS browsing flow with balanced bidirectional packets and standard TCP handshake.',
    rawLog: `Flow ID: 192.168.10.15-192.168.10.3-51824-443-6
Source IP: 192.168.10.15
Source Port: 51824
Destination IP: 192.168.10.3
Destination Port: 443
Protocol: 6 (TCP)
Timestamp: 07/07/2017 10:45:12
Flow Duration: 5821034
Total Fwd Packets: 19
Total Backward Packets: 22
Total Length of Fwd Packets: 2704
Total Length of Bwd Packets: 19593
Fwd Packet Length Max: 517
Fwd Packet Length Min: 0
Fwd Packet Length Mean: 142.31
Bwd Packet Length Max: 1460
Bwd Packet Length Min: 0
Bwd Packet Length Mean: 890.59
Flow Bytes/s: 3830.41
Flow Packets/s: 7.04
Flow IAT Mean: 145525.85
Flow IAT Std: 412894.12
Flow IAT Max: 2014892
SYN Flag Count: 1
RST Flag Count: 0
PSH Flag Count: 9
ACK Flag Count: 38
FIN Flag Count: 1
Down/Up Ratio: 1
Average Packet Size: 543.82
Subflow Fwd Packets: 19
Subflow Fwd Bytes: 2704
Init_Win_bytes_forward: 29200
Init_Win_bytes_backward: 28960`
  },
  {
    id: 'cic-exfiltration-highbytes',
    name: 'Exfiltration · High Byte Outbound',
    category: 'Potential Exfiltration',
    expectedSeverity: 'CRITICAL',
    benchmarkRule: 'Unusual destination ports with high byte count -> Potential Exfiltration or Brute Force',
    description: 'Anomalous outbound flow to unassigned high port 9001 with massive forward byte volume (2.4 MB) indicating exfiltration.',
    rawLog: `Flow ID: 192.168.10.8-205.174.165.73-44912-9001-6
Source IP: 192.168.10.8
Source Port: 44912
Destination IP: 205.174.165.73
Destination Port: 9001
Protocol: 6 (TCP)
Timestamp: 07/07/2017 14:22:08
Flow Duration: 14820109
Total Fwd Packets: 1684
Total Backward Packets: 842
Total Length of Fwd Packets: 2458624
Total Length of Bwd Packets: 43784
Fwd Packet Length Max: 1460
Fwd Packet Length Min: 64
Fwd Packet Length Mean: 1459.99
Bwd Packet Length Max: 52
Bwd Packet Length Min: 52
Flow Bytes/s: 168852.12
Flow Packets/s: 170.44
Flow IAT Mean: 8802.91
Flow IAT Std: 12401.55
Flow IAT Max: 89201
SYN Flag Count: 1
RST Flag Count: 0
PSH Flag Count: 840
ACK Flag Count: 2520
FIN Flag Count: 0
Down/Up Ratio: 0
Average Packet Size: 990.65
Subflow Fwd Packets: 1684
Subflow Fwd Bytes: 2458624
Init_Win_bytes_forward: 65535
Init_Win_bytes_backward: 32768`
  },
  {
    id: 'cic-ftp-patator',
    name: 'FTP-Patator · Port 21 Brute Force',
    category: 'Brute Force Attack',
    expectedSeverity: 'HIGH',
    benchmarkRule: 'Unusual destination ports with high byte count -> Potential Exfiltration or Brute Force',
    description: 'Repeated high-packet authentication burst on control port 21 (FTP) indicating automated credential dictionary brute force.',
    rawLog: `Flow ID: 172.16.0.1-192.168.10.50-51920-21-6
Source IP: 172.16.0.1
Source Port: 51920
Destination IP: 192.168.10.50
Destination Port: 21
Protocol: 6 (TCP)
Timestamp: 07/07/2017 11:34:19
Flow Duration: 1284920
Total Fwd Packets: 28
Total Backward Packets: 26
Total Length of Fwd Packets: 4892
Total Length of Bwd Packets: 3218
Fwd Packet Length Max: 380
Fwd Packet Length Min: 0
Fwd Packet Length Mean: 174.71
Bwd Packet Length Max: 210
Bwd Packet Length Min: 0
Bwd Packet Length Mean: 123.76
Flow Bytes/s: 6311.67
Flow Packets/s: 42.02
Flow IAT Mean: 24243.77
Flow IAT Max: 120482
SYN Flag Count: 1
RST Flag Count: 0
PSH Flag Count: 18
ACK Flag Count: 53
FIN Flag Count: 1
Down/Up Ratio: 0
Average Packet Size: 150.18
Subflow Fwd Packets: 28
Subflow Fwd Bytes: 4892
Init_Win_bytes_forward: 8192
Init_Win_bytes_backward: 8192`
  }
];
