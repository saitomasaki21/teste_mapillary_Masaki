export const imageIds = [
  532582459129057,
  1548741512383121,
  1452951302053880,
  2474641246068877
];

export const coordinates = async () => {
  const coordinates = await Promise.all(imageIds.map(async (imageIds) => {
    const url = `https://graph.mapillary.com/${imageId}?fields=computed_geometry&access_token=${mapillaryAccessToken}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.computed_geometry && data.computed_geometry.coordinates) {
        const [longitude, latitude] = data.computed_geometry.coordinates;
        return { imageId, latitude, longitude };
      } else {
        console.error(`Coordinates not available for image ID: ${imageId}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching data for image ID: ${imageId}`, error);
      return null;
    }
  }));
