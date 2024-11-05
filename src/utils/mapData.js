// Array com os imageIds do Mapillary
export const imageIds = [
  532582459129057,
  1548741512383121,
  1452951302053880,
  2474641246068877
];

// Variável para armazenar as coordenadas
let coordinates = [];

// Função para obter as coordenadas a partir do Mapillary
async function fetchCoordinates(imageIds) {
  const coords = [];

  for (const id of imageIds) {
    try {
      const response = await fetch(`https://a.mapillary.com/v3/images/${id}?client_id=YOUR_CLIENT_ID`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar a imagem com ID ${id}: ${response.statusText}`);
      }
      const data = await response.json();
      // Adiciona as coordenadas ao array
      coords.push({
        latitude: data.lat,
        longitude: data.lon,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return coords;
}

// Função para inicializar as coordenadas
export async function initCoordinates() {
  coordinates = await fetchCoordinates(imageIds);
}

// Exporta a variável de coordenadas
export const getCoordinates = () => coordinates;

