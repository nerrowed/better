// File parser.ts (lib/parser.ts)

import type { LecturersRecord, StudentsRecord } from '@/types/pocketbase';
import Papa from 'papaparse';

type CSVRow = Record<string, string | number | boolean | undefined>;

export const parseLecturerCSV = (
  csvText: string
): (Partial<LecturersRecord> & {
  password?: string;
  passwordConfirm?: string;
})[] => {
  const { data } = Papa.parse<CSVRow>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const results: (Partial<LecturersRecord> & {
    password?: string;
    passwordConfirm?: string;
  })[] = [];

  for (const row of data) {
    const record: Partial<LecturersRecord> & {
      password?: string;
      passwordConfirm?: string;
    } = {
      name: row['Nama'] ? String(row['Nama']).trim() : '',
      nip: row['NIP'] ? String(row['NIP']).trim() : '',
      nidn: row['NIDN'] ? String(row['NIDN']).trim() : '',
      email: row['Email'] ? String(row['Email']).trim() : '',
      password: row['Password'] ? String(row['Password']).trim() : '',
      passwordConfirm: row['Password'] ? String(row['Password']).trim() : '',
      emailVisibility: true,
    };

    if (record.name && record.nip && record.email && record.password) {
      results.push(record);
    }
  }

  return results;
};

export const parseStudentCSV = (
  csvText: string
): (Partial<StudentsRecord> & {
  password?: string;
  passwordConfirm?: string;
})[] => {
  const lines = csvText
    .trim()
    .split('\n')
    .filter(line => line.trim() !== '');
  if (lines.length === 0) return [];

  const dataLines = lines.slice(1);
  const results: (Partial<StudentsRecord> & {
    password?: string;
    passwordConfirm?: string;
  })[] = [];

  for (const line of dataLines) {
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, '')); // Basic trim quotes if any
    if (values.length < 4) continue;

    const record: Partial<StudentsRecord> & {
      password?: string;
      passwordConfirm?: string;
    } = {
      name: values[0],
      nim: values[1],
      email: values[2],
      password: values[3],
      passwordConfirm: values[3],
      emailVisibility: true,
    };

    if (record.name && record.nim && record.email && record.password) {
      results.push(record);
    }
  }

  return results;
};
