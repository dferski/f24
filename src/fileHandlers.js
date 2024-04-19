import * as XLSX from 'xlsx';

export async function getEuroRate(date) {
  try {
    const response = await fetch(`http://api.nbp.pl/api/exchangerates/rates/a/eur/${date}/`);
    if (!response.ok) {
      throw new Error('Problem with fetching data');
    }
    const data = await response.json();
    return data.rates[0].mid; // Zwracamy średni kurs
  } catch (error) {
    console.error('Error fetching euro rate:', error);
    return null; // W przypadku błędu zwróc null lub odpowiednią wartość domyślną
  }
}

export async function handleFileUpload(event, setFileData) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = async (event) => {
    const wb = XLSX.read(event.target.result, { type: 'binary' });
    const sheetName = wb.SheetNames[0];
    const sheet = wb.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { raw: false });

    const promises = data.map(async row => {
      if (row['Data rozliczeń']) {  // Sprawdź, czy data rozliczeń istnieje
        const formattedDate = row['Data rozliczeń'].replace(/-/g, '/');
        const rate = await getEuroRate(formattedDate);
        return { ...row, 'Kurs euro z NBP': rate || 'Brak danych' };
      }
      return { ...row, 'Kurs euro z NBP': 'Brak danych' };  // Ustaw brak danych, gdy nie ma daty
    });

    const updatedData = await Promise.all(promises);
    setFileData(updatedData);
  };
  reader.readAsBinaryString(file);
}
