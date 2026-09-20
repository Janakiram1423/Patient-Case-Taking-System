export function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatTime(dateTimeString?: string): string {
  if (!dateTimeString) return 'N/A';
  try {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return dateTimeString;
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateTimeString;
  }
}

export function formatDateTime(dateTimeString?: string): string {
  if (!dateTimeString) return 'N/A';
  try {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return dateTimeString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateTimeString;
  }
}

export function calculateAge(dobString?: string): number {
  if (!dobString) return 0;
  try {
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? age : 0;
  } catch {
    return 0;
  }
}

export function generatePatientId(existingIds: Iterable<string> = []): string {
  const year = new Date().getFullYear();
  let highestNumber = 0;

  for (const patientId of existingIds) {
    const match = patientId.match(/^PAT-\d{4}-(\d+)$/);
    if (match) highestNumber = Math.max(highestNumber, Number(match[1]));
  }

  return `PAT-${year}-${(highestNumber + 1).toString().padStart(4, '0')}`;
}

export function generateRegistrationNumber(existingNumbers: Iterable<string> = []): string {
  const year = new Date().getFullYear();
  let highestNumber = 0;

  for (const regNumber of existingNumbers) {
    const match = regNumber.match(/^REG-\d{4}-(\d+)$/);
    if (match) highestNumber = Math.max(highestNumber, Number(match[1]));
  }

  return `REG-${year}-${(highestNumber + 1).toString().padStart(4, '0')}`;
}

export function generateUHID(existingUHIDs: Iterable<string> = []): string {
  const year = new Date().getFullYear();
  let highestNumber = 0;

  for (const uhid of existingUHIDs) {
    const match = uhid.match(/^UHID-\d{4}-(\d+)$/);
    if (match) highestNumber = Math.max(highestNumber, Number(match[1]));
  }

  return `UHID-${year}-${(highestNumber + 1).toString().padStart(4, '0')}`;
}

export function generateCaseId(patientId: string, visitNumber: number): string {
  const shortPid = patientId.replace('PAT-', '');
  return `CASE-${shortPid}-V${visitNumber}`;
}

export function generateAppointmentId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `APT-${year}-${randomNum}`;
}

export function generatePrescriptionId(): string {
  return `RX-${Date.now().toString().slice(-6)}`;
}

export function exportToCSV(filename: string, rows: object[]): void {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map(row => {
        return keys
          .map(k => {
            let cell = (row as any)[k] === null || (row as any)[k] === undefined ? '' : (row as any)[k];
            cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
