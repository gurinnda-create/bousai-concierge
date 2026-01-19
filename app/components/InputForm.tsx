"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserInput } from '../types';
import { Shield, Users, Home, MapPin, Baby, Cat, Wallet, Package } from 'lucide-react';
import clsx from 'clsx';

interface Props {
    onSubmit: (input: UserInput) => void;
}

const regions = [
    '北海道', '東北', '関東', '中部', '近畿', '中国', '四国', '九州・沖縄'
];

const budgetOptions = [
    { value: 10000, label: '〜1万円' },
    { value: 30000, label: '〜3万円' },
    { value: 50000, label: '〜5万円' },
    { value: 100000, label: '〜10万円' },
];

export default function InputForm({ onSubmit }: Props) {
    const [input, setInput] = useState<UserInput>({
        familySize: 2,
        housingType: 'mansion',
        region: '関東',
        hasElderly: false,
        hasChildren: false,
        hasPets: false,
        budget: 30000,
        currentPreparedness: 'none',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(input);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-lg"
        >
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                    <Shield className="w-8 h-8 text-orange-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">防災グッズ AI診断</h1>
                <p className="text-gray-500 mt-2">あなたの家庭に最適な防災グッズを提案します</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 家族人数 */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Users size={18} />
                        家族人数
                    </label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(num => (
                            <button
                                key={num}
                                type="button"
                                onClick={() => setInput({ ...input, familySize: num })}
                                className={clsx(
                                    "flex-1 py-3 rounded-lg font-medium transition-all",
                                    input.familySize === num
                                        ? "bg-orange-500 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                            >
                                {num}{num === 5 ? '+' : ''}人
                            </button>
                        ))}
                    </div>
                </div>

                {/* 住居タイプ */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Home size={18} />
                        住居タイプ
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { value: 'apartment', label: 'アパート' },
                            { value: 'mansion', label: 'マンション' },
                            { value: 'house', label: '戸建て' },
                        ].map(option => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setInput({ ...input, housingType: option.value as any })}
                                className={clsx(
                                    "py-3 rounded-lg font-medium transition-all text-sm",
                                    input.housingType === option.value
                                        ? "bg-orange-500 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 地域 */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <MapPin size={18} />
                        お住まいの地域
                    </label>
                    <select
                        value={input.region}
                        onChange={(e) => setInput({ ...input, region: e.target.value })}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        {regions.map(region => (
                            <option key={region} value={region}>{region}</option>
                        ))}
                    </select>
                </div>

                {/* 家族構成 */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">家族構成</label>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setInput({ ...input, hasElderly: !input.hasElderly })}
                            className={clsx(
                                "flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2",
                                input.hasElderly
                                    ? "bg-orange-500 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            )}
                        >
                            👴 高齢者
                        </button>
                        <button
                            type="button"
                            onClick={() => setInput({ ...input, hasChildren: !input.hasChildren })}
                            className={clsx(
                                "flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2",
                                input.hasChildren
                                    ? "bg-orange-500 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            )}
                        >
                            <Baby size={18} /> 子供
                        </button>
                        <button
                            type="button"
                            onClick={() => setInput({ ...input, hasPets: !input.hasPets })}
                            className={clsx(
                                "flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2",
                                input.hasPets
                                    ? "bg-orange-500 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            )}
                        >
                            <Cat size={18} /> ペット
                        </button>
                    </div>
                </div>

                {/* 予算 */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Wallet size={18} />
                        予算
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                        {budgetOptions.map(option => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setInput({ ...input, budget: option.value })}
                                className={clsx(
                                    "py-3 rounded-lg font-medium transition-all text-sm",
                                    input.budget === option.value
                                        ? "bg-orange-500 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 現在の備蓄状況 */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Package size={18} />
                        現在の備蓄状況
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { value: 'none', label: 'なし' },
                            { value: 'basic', label: '最低限' },
                            { value: 'partial', label: '一部あり' },
                        ].map(option => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setInput({ ...input, currentPreparedness: option.value as any })}
                                className={clsx(
                                    "py-3 rounded-lg font-medium transition-all text-sm",
                                    input.currentPreparedness === option.value
                                        ? "bg-orange-500 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 送信ボタン */}
                <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl"
                >
                    🛡️ AIで最適な防災グッズを診断する
                </button>
            </form>
        </motion.div>
    );
}
