const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Liste des écoles à scraper
const schools = [
  {
    name: 'INSA',
    url: 'https://www.insa-toulouse.fr',
    searchTerms: ['portes ouvertes', 'concours', 'admission']
  },
  {
    name: 'Telecom SudParis',
    url: 'https://www.telecom-sudparis.eu',
    searchTerms: ['portes ouvertes', 'concours', 'admission']
  },
  {
    name: 'ENSEA',
    url: 'https://www.ensea.fr',
    searchTerms: ['portes ouvertes', 'concours', 'admission']
  },
  {
    name: 'IMT Atlantique',
    url: 'https://www.imt-atlantique.fr',
    searchTerms: ['portes ouvertes', 'concours', 'admission']
  },
  {
    name: 'ENSEEIHT',
    url: 'https://www.enseeiht.fr',
    searchTerms: ['portes ouvertes', 'concours', 'admission']
  },
  {
    name: 'UTC',
    url: 'https://www.utc.fr',
    searchTerms: ['portes ouvertes', 'concours', 'admission']
  },
  {
    name: 'ICAM',
    url: 'https://www.icam.fr',
    searchTerms: ['portes ouvertes', 'concours', 'admission']
  }
];

async function scrapeSchool(school) {
  try {
    console.log(`Scraping ${school.name}...`);
    const response = await axios.get(school.url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // Cherche les textes contenant des infos sur portes ouvertes, concours
    const events = [];
    const text = $('body').text();
    
    // Cherche les dates (simple pattern)
    const datePattern = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g;
    const dates = text.match(datePattern) || [];
    
    return {
      name: school.name,
      url: school.url,
      lastUpdated: new Date().toISOString(),
      events: dates.slice(0, 5), // Prend les 5 premières dates trouvées
      status: 'success'
    };
  } catch (error) {
    console.error(`Error scraping ${school.name}: ${error.message}`);
    return {
      name: school.name,
      url: school.url,
      lastUpdated: new Date().toISOString(),
      events: [],
      status: 'error',
      error: error.message
    };
  }
}

async function main() {
  console.log('Starting scraper...');
  const results = [];
  
  for (const school of schools) {
    const data = await scrapeSchool(school);
    results.push(data);
    // Délai pour ne pas surcharger les serveurs
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Sauvegarde en JSON
  fs.writeFileSync('schools-data.json', JSON.stringify(results, null, 2));
  console.log('Data saved to schools-data.json');
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
