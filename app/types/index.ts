export interface UserInput {
    familySize: number;           // 家族人数
    housingType: 'apartment' | 'house' | 'mansion';  // 住居タイプ
    region: string;               // 地域（地震リスク等）
    hasElderly: boolean;          // 高齢者がいるか
    hasChildren: boolean;         // 子供がいるか
    hasPets: boolean;             // ペットがいるか
    budget: number;               // 予算
    currentPreparedness: 'none' | 'basic' | 'partial';  // 現在の備蓄状況
}

export interface BousaiItem {
    id: string;
    name: string;
    price: number;
    description: string;
    reason: string;               // なぜこの家族に必要か
    priority: 'essential' | 'recommended' | 'optional';  // 優先度
    category: string;             // カテゴリ（水、食料、照明等）
    imageUrl: string;
    youtubeIds?: string[];
}
