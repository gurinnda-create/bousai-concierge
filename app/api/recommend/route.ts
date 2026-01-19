import { NextRequest, NextResponse } from 'next/server';
import { model } from '@/app/lib/gemini';
import { UserInput, BousaiItem } from '@/app/types';
import { searchYouTubeVideos } from '@/app/lib/youtube';
import { searchGoogleImages } from '@/app/lib/image-search';

export async function POST(req: NextRequest) {
    if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
    }

    try {
        const input: UserInput = await req.json();

        const housingName = {
            'apartment': 'アパート',
            'house': '戸建て',
            'mansion': 'マンション'
        }[input.housingType];

        const preparednessName = {
            'none': '備蓄なし',
            'basic': '最低限の備蓄あり',
            'partial': '一部備蓄あり'
        }[input.currentPreparedness];

        const prompt = `
            あなたは防災の専門家です。以下の家庭に最適な防災グッズを5〜7個提案してください。

            【家庭情報】
            - 家族人数: ${input.familySize}人
            - 住居タイプ: ${housingName}
            - 地域: ${input.region}
            - 高齢者: ${input.hasElderly ? 'いる' : 'いない'}
            - 子供: ${input.hasChildren ? 'いる' : 'いない'}
            - ペット: ${input.hasPets ? 'いる' : 'いない'}
            - 予算: ${input.budget.toLocaleString()}円
            - 現在の備蓄状況: ${preparednessName}

            【重要な指示】
            - 具体的なブランド名・商品名で提案してください（例：「パナソニック 手回し充電ラジオ RF-TJ20」）
            - 価格は実際の市場価格に基づいてください
            - 予算 ${input.budget.toLocaleString()}円 の範囲内で優先度順に提案
            - 家族構成に合わせた提案（高齢者向け、子供向け、ペット向けを考慮）
            - priority: "essential"（必須）, "recommended"（推奨）, "optional"（あると便利）で分類

            【出力形式】JSON配列
            [
                {
                    "name": "ブランド名 - 商品名",
                    "price": 3000,
                    "description": "商品の説明（50字以内）",
                    "reason": "この家庭に必要な理由（50字以内）",
                    "priority": "essential",
                    "category": "カテゴリ（水、食料、照明、通信、衛生、救急、避難用品など）"
                }
            ]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const items: any[] = JSON.parse(text);

        // 予算内でフィルタリング
        let totalPrice = 0;
        const filteredItems = items.filter(item => {
            if (totalPrice + item.price <= input.budget * 1.1) {
                totalPrice += item.price;
                return true;
            }
            return false;
        });

        const bousaiItems: BousaiItem[] = filteredItems.map((item: any, index: number) => ({
            id: `bousai-${Date.now()}-${index}`,
            name: item.name,
            price: item.price,
            description: item.description,
            reason: item.reason,
            priority: item.priority,
            category: item.category,
            imageUrl: 'https://placehold.co/400x300?text=Loading...',
            youtubeIds: undefined,
        }));

        // 並列で画像とYouTube動画を取得
        const itemsWithMedia = await Promise.all(bousaiItems.map(async (item) => {
            try {
                const [videoIds, imageUrl] = await Promise.all([
                    searchYouTubeVideos(item.name),
                    searchGoogleImages(item.name + " 防災")
                ]);

                return {
                    ...item,
                    youtubeIds: videoIds.length > 0 ? videoIds : undefined,
                    imageUrl: imageUrl || 'https://placehold.co/400x300?text=No+Image'
                };
            } catch (e) {
                return item;
            }
        }));

        return NextResponse.json(itemsWithMedia);

    } catch (error: any) {
        console.error("AI Error:", error?.message);
        return NextResponse.json({
            error: error?.message || 'Failed to generate recommendations'
        }, { status: 500 });
    }
}
