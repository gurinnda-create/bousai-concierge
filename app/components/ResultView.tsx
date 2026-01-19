"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BousaiItem, UserInput } from '../types';
import { ExternalLink, Play, X, ChevronLeft, ChevronRight, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

interface Props {
    items: BousaiItem[];
    input: UserInput;
    onRestart: () => void;
}

export default function ResultView({ items, input, onRestart }: Props) {
    const [selectedVideo, setSelectedVideo] = useState<{ ids: string[], index: number } | null>(null);

    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

    const priorityConfig = {
        essential: { label: '必須', color: 'bg-red-500', icon: AlertTriangle },
        recommended: { label: '推奨', color: 'bg-orange-500', icon: Shield },
        optional: { label: 'あると便利', color: 'bg-green-500', icon: CheckCircle },
    };

    const handleVideoClick = (ids: string[]) => {
        setSelectedVideo({ ids, index: 0 });
    };

    const handleNextVideo = () => {
        if (selectedVideo && selectedVideo.index < selectedVideo.ids.length - 1) {
            setSelectedVideo({ ...selectedVideo, index: selectedVideo.index + 1 });
        }
    };

    const handlePrevVideo = () => {
        if (selectedVideo && selectedVideo.index > 0) {
            setSelectedVideo({ ...selectedVideo, index: selectedVideo.index - 1 });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
                        <Shield className="w-10 h-10 text-orange-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">あなた専用の防災セット</h1>
                    <p className="text-gray-500">
                        {input.familySize}人家族 / {input.region} / 予算{input.budget.toLocaleString()}円
                    </p>
                    <div className="mt-4 inline-block bg-orange-500 text-white px-6 py-2 rounded-full font-bold">
                        合計: ¥{totalPrice.toLocaleString()}
                    </div>
                </motion.div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item, index) => {
                        const priority = priorityConfig[item.priority];
                        const PriorityIcon = priority.icon;

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                {/* Priority Badge */}
                                <div className={clsx("px-4 py-2 flex items-center gap-2", priority.color)}>
                                    <PriorityIcon size={16} className="text-white" />
                                    <span className="text-white text-sm font-bold">{priority.label}</span>
                                    <span className="text-white/80 text-xs ml-auto">{item.category}</span>
                                </div>

                                {/* Image */}
                                <div className="relative h-48 bg-gray-100">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="w-full h-full object-contain p-4"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=No+Image';
                                        }}
                                    />
                                    {item.youtubeIds && item.youtubeIds.length > 0 && (
                                        <button
                                            onClick={() => handleVideoClick(item.youtubeIds!)}
                                            className="absolute bottom-4 right-4 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors"
                                        >
                                            <Play size={20} fill="white" />
                                        </button>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-800 text-lg mb-1">{item.name}</h3>
                                    <p className="text-2xl font-bold text-orange-600 mb-2">
                                        ¥{item.price.toLocaleString()}
                                    </p>
                                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                                    <div className="bg-orange-50 p-3 rounded-lg">
                                        <p className="text-orange-800 text-sm">
                                            💡 {item.reason}
                                        </p>
                                    </div>

                                    {/* Shop Links */}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <a
                                            href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(item.name)}&tag=giftconcierge-22`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 min-w-[70px] py-2 bg-[#FF9900] text-white text-center text-xs font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
                                        >
                                            Amazon <ExternalLink size={10} />
                                        </a>
                                        <a
                                            href={`https://hb.afl.rakuten.co.jp/hgc/5026c068.716cbf0d.5026b962.3c6c4724/?pc=${encodeURIComponent(`https://search.rakuten.co.jp/search/mall/${item.name}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 min-w-[70px] py-2 bg-[#BF0000] text-white text-center text-xs font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
                                        >
                                            楽天 <ExternalLink size={10} />
                                        </a>
                                        <a
                                            href={`https://shopping.yahoo.co.jp/search?p=${encodeURIComponent(item.name)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 min-w-[70px] py-2 bg-[#FF0033] text-white text-center text-xs font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
                                        >
                                            Yahoo! <ExternalLink size={10} />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Restart Button */}
                <div className="text-center mt-12">
                    <button
                        onClick={onRestart}
                        className="px-8 py-3 border-2 border-orange-500 text-orange-500 rounded-full font-bold hover:bg-orange-500 hover:text-white transition-colors"
                    >
                        もう一度診断する
                    </button>
                </div>
            </div>

            {/* Video Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="relative w-full max-w-4xl">
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300"
                        >
                            <X size={32} />
                        </button>

                        <div className="aspect-video">
                            <iframe
                                src={`https://www.youtube.com/embed/${selectedVideo.ids[selectedVideo.index]}?autoplay=1`}
                                className="w-full h-full rounded-lg"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>

                        {selectedVideo.ids.length > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-4">
                                <button
                                    onClick={handlePrevVideo}
                                    disabled={selectedVideo.index === 0}
                                    className="text-white disabled:opacity-30"
                                >
                                    <ChevronLeft size={32} />
                                </button>
                                <span className="text-white">
                                    {selectedVideo.index + 1} / {selectedVideo.ids.length}
                                </span>
                                <button
                                    onClick={handleNextVideo}
                                    disabled={selectedVideo.index === selectedVideo.ids.length - 1}
                                    className="text-white disabled:opacity-30"
                                >
                                    <ChevronRight size={32} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
