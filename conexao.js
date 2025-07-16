// test-db.ts
import { Client } from 'pg';

const client = new Client({
connectionString: "postgresql://postgres:aVINLaxtuuAyQYXJkXTxfjEaXztogwMC@nozomi.proxy.rlwy.net:34875/railway", // ou insira a string diretamente aqui
  // ssl: { rejectUnauthorized: false }, // descomente se estiver usando SSL como no Railway
});

async function testConnection() {
  try {
    await client.connect();
    console.log('✅ Banco de dados conectado com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao conectar no banco:', err.message);
  } finally {
    await client.end();
  }
}

testConnection();
