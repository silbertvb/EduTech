require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const { query, pool } = require('../config/db');

const MAPPING = [
  { match: /html/i, file: '/uploads/courses/html-css.jpg' },
  { match: /javascript/i, file: '/uploads/courses/javascript.jpg' },
  { match: /python/i, file: '/uploads/courses/python.jpg' },
];

async function main() {
  const courses = await query('SELECT id, title, cover_image FROM courses ORDER BY id');
  console.log('\nCursos actuales:');
  courses.forEach(c => console.log(`  [${c.id}] ${c.title} => ${c.cover_image || 'SIN IMAGEN'}`));

  for (const c of courses) {
    const entry = MAPPING.find(m => m.match.test(c.title));
    if (entry && c.cover_image !== entry.file) {
      await query('UPDATE courses SET cover_image = $1 WHERE id = $2', [entry.file, c.id]);
      console.log(`  -> [${c.id}] actualizado a ${entry.file}`);
    }
  }

  await pool.end();
}

main().catch(console.error);
