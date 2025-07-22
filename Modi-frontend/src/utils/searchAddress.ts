export interface AddressResult {
  fullAddress: string;
  dong: string;
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

  if (!response.ok) {
    throw new Error("주소 검색 실패");
  }

  const data = await response.json();

  interface KakaoAddressDocument {
    address?: {
      address_name: string;
      region_3depth_name: string;
    };
  }

  return data.documents
    .filter((doc: KakaoAddressDocument) => doc.address?.region_3depth_name)
    .map((doc: KakaoAddressDocument) => ({
      fullAddress: doc.address!.address_name,
      dong: doc.address!.region_3depth_name,
    }));
};
