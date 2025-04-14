import Request from "@/app/api/service/Request";

export async function fetchDataSSR(endpoint: string) {
  try {
    const response = await Request.get(endpoint);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching data for SSR:', error);
    throw error;
  }
}