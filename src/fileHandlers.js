// Importujemy XLSX zgodnie z potrzebami pliku
import * as XLSX from 'xlsx';

export async function getEuroRate() {
  const response = await fetch('http://api.nbp.pl/api/exchangerates/rates/a/eur/');
  const data = await response.json();
  return data.rates[0].mid; // Zwracamy średni kurs
}

export function handleFileUpload(event, setFileData, setEuroRate) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = async (event) => { // Zmiana na funkcję asynchroniczną
    const wb = XLSX.read(event.target.result, { type: 'binary' });
    const sheetName = wb.SheetNames[0];
    const sheet = wb.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { raw: false });

    const euroRate = await getEuroRate(); // Pobieramy kurs euro
    setEuroRate(euroRate); // Możemy ustawić stan kursu euro, jeśli potrzebujemy

    const updatedData = data.map(row => ({
      ...row,
      'Kurs euro z NBP': euroRate, // Dodajemy kurs euro do każdej pozycji
      'Zysk w PLN': '' // Pusta wartość dla nowej kolumny
    }));

    setFileData(updatedData);
  };
  reader.readAsBinaryString(file);
}
