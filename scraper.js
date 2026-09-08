const fs = require('fs');
const https = require('https');
const http = require('http');

// Liste des écoles
const schools = [
  { name: 'INSA Toulouse', url: 'https://www.insa-toulouse.fr', type: 'Prépa intégrée' },
  { name: 'INSA Lyon', url: 'https://www.insa-lyon.fr', type: 'Prépa intégrée' },
  { name: 'INSA Rennes', url: 'https://www.insa-rennes.fr', type: 'Prépa intégrée' },
  { name: 'INSA Strasbourg', url: 'https://www.insa-strasbourg.fr', type: 'Prépa intégrée' },
  { name: 'INSA Rouen', url: 'https://www.insa-rouen.fr', type: 'Prépa intégrée' },
  { name: 'INSA Hauts-de-France', url: 'https://www.insa-hauts-de-france.fr', type: 'Prépa intégrée' },
  { name: 'INSA Centre Val de Loire', url: 'https://www.insa-cvl.fr', type: 'Prépa intégrée' },
  { name: 'Polytech Paris-Saclay', url: 'https://www.polytech.universite-paris-saclay.fr', type: 'Polytech' },
  { name: 'Polytech Montpellier', url: 'https://www.polytech.univ-montp2.fr', type: 'Polytech' },
  { name: 'Polytech Toulouse', url: 'https://www.polytech-toulouse.fr', type: 'Polytech' },
  { name: 'Polytech Nice Sophia', url: 'https://www.polytech.univ-cotedazur.fr', type: 'Polytech' },
  { name: 'Polytech Lyon', url: 'https://www.polytech-lyon.fr', type: 'Polytech' },
  { name: 'Telecom Paris (IP Paris)', url: 'https://www.telecom-paris.fr', type: 'École spécialisée' },
  { name: 'Telecom SudParis', url: 'https://www.telecom-sudparis.eu', type: 'École spécialisée' },
  { name: 'Grenoble INP - Ensimag', url: 'https://ensimag.grenoble-inp.fr', type: 'Prépa intégrée' },
  { name: 'ENSEEIHT', url: 'https://www.toulouse-inp.fr', type: 'Prépa intégrée' },
  { name: 'UTC Compiègne', url: 'https://www.utc.fr', type: 'Prépa intégrée' },
  { name: 'ENSEA', url: 'https://www.ensea.fr', type: 'Prépa intégrée' },
  { name: 'IMT Atlantique', url: 'https://www.imt-atlantique.fr', type: 'Prépa intégrée' },
  { name: 'ICAM', url: 'https://www.icam.fr', type: 'Prépa intégrée' },
  { name: 'CPE Lyon', url: 'https://www.cpe.fr', type: 'Prépa intégrée' },
  { name: 'ESIEE Paris', url: 'https://www.esiee.fr', type: 'Prépa intégrée' },
  { name: 'Sup Galilée', url: 'https://galilee.univ-paris13.fr', type: 'Prépa intégrée' },
  { name: 'CY Tech', url: 'https://cytech.cyu.fr', type: 'Prépa intégrée' },
  { name: 'Arts et Métiers', url: 'https://www.artsetmetiers.fr', type: 'Prépa intégrée' },
  { name: 'ESTP Paris', url: 'https://www.estp.fr', type: 'École' },
  { name: 'ECE Paris', url: 'https://www.ece.fr', type: 'Prépa intégrée' },
  { name: 'ISEP Paris', url: 'https://www.isep.fr', type: 'Prépa intégrée' },
  { name: 'ESILV', url: 'https://www.esilv.fr', type: 'Prépa intégrée' },
  { name: 'ESIGELEC', url: 'https://www.esigelec.fr', type: 'Prépa intégrée' },
];

function fetchUrl(urlString) {
  return new Promise((resolve) => {
    const protocol = urlString.startsWith('https') ? https : http;
    const request = protocol.get(urlString, { timeout: 3000 }, (response) => {
      let data = '';
      response.on('data', chunk => { data += chunk; });
      response.on('end', () => {
        resolve({
          name: urlString.split('/')[2],
          dates: (data.match(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/g) || []).slice(0, 5),
          status: 'success'
        });
      });
    }).on('error', () => {
      resolve({ name: urlString.split('/')[2], dates: [], status: 'error' });
    });
    request.end();
  });
}

async function main() {
  console.log('Starting scraper...');
  const results = [];
  
  for (const school of schools) {
    const data = await fetchUrl(school.url);
    results.push({
      name: school.name,
      url: school.url,
      type: school.type,
      lastUpdated: new Date().toISOString(),
      events: data.dates,
      status: data.status
    });
    await new Promise(r => setTimeout(r, 500));
  }
  
  fs.writeFileSync('schools-data.json', JSON.stringify(results, null, 2));
  console.log('✓ Data saved!');
}

main().catch(console.error);
