export const getConvertAddress = async (center: { lng: number; lat: number }) => {
  try {
    const response = await fetch(`/api/mapApi/getConvertPosition?x=${center.lng}&y=${center.lat}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error in getConvertAddress:', error);
  }
};