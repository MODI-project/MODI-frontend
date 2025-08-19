export interface AddressResult {
  fullAddress: string;
  dong: string;
  latitude: number;
  longitude: number;
}

export const searchKakaoAddress = async (
  query: string
): Promise<AddressResult[]> => {
  const REST_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;

  const response = await fetch(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
      query
    )}`,
    {
      headers: {
        Authorization: `KakaoAK ${REST_API_KEY}`,
      },
    }
  );

  if (!response.ok) throw new Error("주소 검색 실패");

  const data = await response.json();

  interface KakaoAddressDocument {
    x?: string;
    y?: string;
    address?: {
      address_name: string;
      region_3depth_name: string;
    };
    road_address?: {
      address_name: string;
    };
  }

  const getFullAddress = (doc: KakaoAddressDocument) =>
    doc.address?.address_name ?? doc.road_address?.address_name ?? "";

  return (data.documents as KakaoAddressDocument[])
    .filter((doc) => !!doc.address?.region_3depth_name && !!doc.x && !!doc.y)
    .map((doc) => ({
      fullAddress: getFullAddress(doc),
      dong: doc.address!.region_3depth_name,
      longitude: parseFloat(doc.x as string),
      latitude: parseFloat(doc.y as string),
    }));
};
