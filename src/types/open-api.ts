//공공 데이터 api 반환 인터패이스

//전국통합식품영양성분정보(가공식품)표준데이터 api 반환 (성공)
export interface NutritionApiResponse {
  header: {
    resultCode: string;
    resultMsg: string;
  };
  body: {
    pageNo: number;
    totalCount: number;
    numOfRows: number;
    items: FoodItem[];
  };
}

export interface FoodItem {
  NUM: string;
  FOOD_CD: string;
  FOOD_NM_KR: string;
  DB_GRP_CM: string;
  DB_GRP_NM: string;
  DB_CLASS_CM: string;
  DB_CLASS_NM: string;
  FOOD_OR_CD: string;
  FOOD_OR_NM: string;
  FOOD_CAT1_CD: string;
  FOOD_CAT1_NM: string;
  FOOD_REF_CD: string;
  FOOD_REF_NM: string;
  FOOD_CAT2_CD: string;
  FOOD_CAT2_NM: string;
  FOOD_CAT3_CD: string;
  FOOD_CAT3_NM: string;
  FOOD_CAT4_CD: string;
  FOOD_CAT4_NM: string;
  SERVING_SIZE: string;

  // 영양소 수치들 (AMT_NUM1 ~ AMT_NUM157)
  [key: `AMT_NUM${number}`]: string | null | undefined;

  SUB_REF_CM: string;
  SUB_REF_NAME: string;
  NUTRI_AMOUNT_SERVING: string;
  Z10500: string;
  DISH_ONE_SERVING: string | null;
  ITEM_REPORT_NO: string;
  MAKER_NM: string | null;
  IMP_MANUFAC_NM: string;
  SELLER_MANUFAC_NM: string;
  IMP_YN: string;
  NATION_CM: string;
  NATION_NM: string;
  CRT_MTH_CD: string;
  CRT_MTH_NM: string;
  RESEARCH_YMD: string;
  UPDATE_DATE: string;
}

//전국통합식품영양성분정보(가공식품)표준데이터 api 반환 (실패)
// {
//   "header": {
//     "resultCode": "00",
//     "resultMsg": "NORMAL SERVICE."
//   },
//   "body": {
//     "pageNo": 100000,
//     "totalCount": 1827,
//     "numOfRows": 1
//   }
// }
export interface OpenApiError {
  header: {
    resultCode: string;
    resultMsg: string;
  };
  body: {
    pageNo: number;
    totalCount: number;
    numOfRows: number;
  };
}
