const fs = require('fs');

const lines = fs.readFileSync('f:/Personal Project/Website/noor/quotes_prompt.txt', 'utf8').split('\n');

const mappedCategories = {
  1: 'Inspirational',
  2: 'Grateful',
  3: 'Patience',
  4: 'Life',
  5: 'Jumma',
  6: 'Knowledge & Education',
  7: 'Ramadan'
};

const quotes = [];
for (const line of lines) {
  if (!line.trim() || line.startsWith('id\t')) continue;
  const parts = line.split('\t');
  if (parts.length < 5) continue;
  
  const idStr = parts[0].trim();
  const id = parseInt(idStr, 10);
  if (isNaN(id)) continue;
  
  const quote = parts[1].trim();
  const reference = parts[3].trim();
  const category_id = parseInt(parts[4].trim(), 10);
  
  if (!quote || isNaN(category_id)) continue;
  
  const category_name = mappedCategories[category_id] || 'Unknown';
  
  quotes.push({
    id,
    quote,
    reference,
    category_id,
    category_name
  });
}

const fileContent = 'export default ' + JSON.stringify(quotes, null, 2) + ';\n';
fs.writeFileSync('f:/Personal Project/Website/noor/src/data/quotes.ts', fileContent);
console.log('Successfully wrote ' + quotes.length + ' quotes.');
