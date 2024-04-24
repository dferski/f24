import * as XLSX from 'xlsx';

export async function fetchYearlyEuroRates() {
  const startDate = '2023-01-01';
  const endDate = '2023-12-31';
  const url = `http://api.nbp.pl/api/exchangerates/rates/a/eur/${startDate}/${endDate}/`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Problem with fetching yearly data');
    }
    const data = await response.json();
    console.log("Raw data from NBP API:", data); // Log surowych danych z API
    const rates = {};
    data.rates.forEach(rate => {
      rates[rate.effectiveDate] = rate.mid;
    });
    console.log("Processed yearly euro rates:", rates); // Log przetworzonych danych
    return rates;
  } catch (error) {
    console.error('Error fetching yearly euro rates:', error);
    return {};
  }
}


export async function handleFileUpload(event, setFileData) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = async (event) => {
    const wb = XLSX.read(event.target.result, { type: 'binary' });
    const sheetName = wb.SheetNames[0];
    const sheet = wb.Sheets[sheetName];
    let data = XLSX.utils.sheet_to_json(sheet, { raw: false });
    console.log("Data from file:", data); // Dodatkowy log dla danych
    if (!data || data.length === 0) {
      console.error("No data loaded from the file or file is empty.");
      return;
    }

    // Dodanie kolumny 'Kurs euro z NBP' z domyślną wartością 'Brak danych' dla każdego wiersza
    data = data.map(row => ({
      ...row,
      'Kurs euro z NBP': 'Brak danych'  // Dodanie nowej kolumny
    }));

    setFileData(data);
  };
  reader.readAsBinaryString(file);
}




export async function getEuroRate(date) {
  try {
    const url = `http://api.nbp.pl/api/exchangerates/rates/a/eur/${date}/`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Problem fetching data from NBP: ${response.statusText}`);
      throw new Error('Problem with fetching data');
    }
    const data = await response.json();
    console.log(`Rate for ${date}:`, data.rates[0].mid);
    return data.rates[0].mid; // Zwracamy średni kurs
  } catch (error) {
    console.error('Error fetching euro rate:', error);
    return 'Brak danych'; // Zwróc 'Brak danych' w przypadku błędu
  }
}


export async function updateEuroRates(data, setFileData, euroRates) {
  const updatedData = data.map(row => {
    const date = row['Data rozliczeń']; // Zakładamy, że data jest w formacie 'YYYY-MM-DD'
    const rate = euroRates[date]; // Pobranie kursu euro dla danej daty
    return {
      ...row,
      'Kurs euro z NBP': rate ? rate : 'Brak danych' // Ustawienie kursu euro lub 'Brak danych', jeśli nie znaleziono kursu
    };
  });

  setFileData(updatedData); // Aktualizacja danych w stanie
  console.log("Updated data with euro rates:", updatedData); // Logowanie zaktualizowanych danych
}
