const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// Liste COMPLÈTE des écoles d'ingénieurs IA/Informatique (dédupliquée)
const schools = [
  // ===== RÉSEAUX MAJEURS =====
  
  // INSA - Réseau national
  { name: 'INSA Toulouse', url: 'https://www.insa-toulouse.fr', type: 'Prépa intégrée' },
  { name: 'INSA Lyon', url: 'https://www.insa-lyon.fr', type: 'Prépa intégrée' },
  { name: 'INSA Rennes', url: 'https://www.insa-rennes.fr', type: 'Prépa intégrée' },
  { name: 'INSA Strasbourg', url: 'https://www.insa-strasbourg.fr', type: 'Prépa intégrée' },
  { name: 'INSA Rouen', url: 'https://www.insa-rouen.fr', type: 'Prépa intégrée' },
  { name: 'INSA Hauts-de-France', url: 'https://www.insa-hauts-de-france.fr', type: 'Prépa intégrée' },
  { name: 'INSA Centre Val de Loire', url: 'https://www.insa-cvl.fr', type: 'Prépa intégrée' },
  
  // Polytech - Réseau de 15 écoles
  { name: 'Polytech Paris-Saclay', url: 'https://www.polytech.universite-paris-saclay.fr', type: 'Polytech' },
  { name: 'Polytech Montpellier', url: 'https://www.polytech.univ-montp2.fr', type: 'Polytech' },
  { name: 'Polytech Toulouse', url: 'https://www.polytech-toulouse.fr', type: 'Polytech' },
  { name: 'Polytech Nice Sophia', url: 'https://www.polytech.univ-cotedazur.fr', type: 'Polytech' },
  { name: 'Polytech Lyon', url: 'https://www.polytech-lyon.fr', type: 'Polytech' },
  
  // ===== ÉCOLES FORTES EN IA =====
  { name: 'Telecom Paris (IP Paris)', url: 'https://www.telecom-paris.fr', type: 'École spécialisée' },
  { name: 'Telecom SudParis', url: 'https://www.telecom-sudparis.eu', type: 'École spécialisée' },
  { name: 'Grenoble INP - Ensimag', url: 'https://ensimag.grenoble-inp.fr', type: 'Prépa intégrée' },
  { name: 'ENSEEIHT', url: 'https://www.toulouse-inp.fr', type: 'Prépa intégrée' },
  { name: 'UTC Compiègne', url: 'https://www.utc.fr', type: 'Prépa intégrée' },
  { name: 'ENSEA', url: 'https://www.ensea.fr', type: 'Prépa intégrée' },
  { name: 'IMT Atlantique', url: 'https://www.imt-atlantique.fr', type: 'Prépa intégrée' },
  
  // ===== AUTRES ÉCOLES PUBLIQUES =====
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
  { name: 'ESTIA', url: 'https://www.estia.fr', type: 'Prépa intégrée' },
  { name: 'EIGSI', url: 'https://www.eigsi.fr', type: 'Prépa intégrée' },
  { name: 'JUNIA', url: 'https://www.junia.org', type: 'Prépa intégrée' },
  { name: 'EPF', url: 'https://www.epf.fr', type: 'Prépa intégrée' },
  { name: 'ESEO', url: 'https://www.eseo.fr', type: 'Prépa intégrée' },
  { name: 'UniLaSalle', url: 'https://www.unilasalle.fr', type: 'Prépa intégrée' },
  { name: 'ESIEA', url: 'https://www.esiea.fr', type: 'Prépa intégrée' },
  { name: 'EPITA', url: 'https://www.epita.fr', type: 'Prépa intégrée' },
  
  // ===== ÉCOLES PAR ALTERNANCE =====
  { name: 'CESI', url: 'https://www.cesi.fr', type: 'Alternance' },
  { name: 'EI.CESI', url: 'https://ei.cesi.fr', type: 'Alternance' },
  { name: 'SeaTech', url: 'https://www.seatech.univ-tln.fr', type: 'Alternance' },
  { name: 'ESAIP', url: 'https://www.esaip.org', type: 'Alternance' },
  
  // ===== MASTERS ET PARCOURS SPÉCIALISÉS =====
  { name: 'Master IA - Paris 8', url: 'https://www.univ-paris8.fr', type: 'Master' },
  { name: 'Master Data Science - PST&B', url: 'https://pstb.org', type: 'Master' },
  { name: 'Aivancity', url: 'https://aivancity.fr', type: 'School spécialisée' },
  { name: 'ensIIE', url: 'https://www.esiee.fr', type: 'Master' },
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
    const text = $('body').text();
    
    // Cherche les dates (pattern: 01/12/2024 ou 01-12-2024)
    const datePattern = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g;
    const dates = [...new Set(text.match(datePattern) || [])].slice(0, 5);
    
    return {
      name: school.name,
      url: school.url,
      type: school.type,
      lastUpdated: new Date().toISOString(),
      events: dates,
      status: 'success'
    };
  } catch (error) {
    console.error(`Error scraping ${school.name}: ${error.message}`);
    return {
      name: school.name,
      url: school.url,
      type: school.type,
      lastUpdated: new Date().toISOString(),
      events: [],
      status: 'error',
      error: error.message
    };
  }
}

async function main() {
  console.log(`Starting scraper... (${schools.length} écoles)`);
  const results = [];
  
  for (const school of schools) {
    const data = await scrapeSchool(school);
    results.push(data);
    await new Promise(resolve => setTimeout(resolve, 800)); // Délai pour respecter les serveurs
  }
  
  fs.writeFileSync('schools-data.json', JSON.stringify(results, null, 2));
  console.log(`✓ Data saved to schools-data.json (${results.length} écoles)`);
}

main().catch(console.error);
