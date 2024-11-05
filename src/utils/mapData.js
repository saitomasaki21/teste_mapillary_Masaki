// Array com os imageIds do Mapillary
export const imageIds = [
  532582459129057,
  1548741512383121,
  1452951302053880,
  2474641246068877
];

// Função para obter as coordenadas a partir do Mapillary
async function fetchCoordinates(imageIds) {
  const coordinates = [];

  for (const id of imageIds) {
    try {
      const response = await fetch(`https://a.mapillary.com/v3/images/${id}?client_id=YOUR_CLIENT_ID`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar a imagem com ID ${id}: ${response.statusText}`);
      }
      const data = await response.json();
      // Adiciona as coordenadas ao array
      coordinates.push({
        latitude: data.lat,
        longitude: data.lon,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return coordinates;
}

// Função assíncrona para inicializar as coordenadas
async function init() {
  export const coordinates = await fetchCoordinates(imageIds);
}

init().catch(error => console.error("Falha ao inicializar as coordenadas:", error));
