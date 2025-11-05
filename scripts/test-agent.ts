import { weatherAgent } from '../src/mastra/agents/weather-agent';

async function test() {
  console.log('🔹 Registrando semilla…');
  const insertResponse = await weatherAgent.generate([
    { role: 'user', content: 'Registrar ingreso de semilla con peso 50 kg, origen Cali, lote a' }
  ]);
  console.log('🟢 Respuesta del registro:', insertResponse);

  console.log('🔹 Buscando semilla…');
  const searchResponse = await weatherAgent.generate([
    { role: 'user', content: 'Buscar el lote a' }
  ]);
  console.log('🟢 Respuesta de la búsqueda:', searchResponse);
}

test();
