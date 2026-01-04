import type { List } from "@/db/schema";

interface PublicHeaderProps {
    list: List;
}

export function PublicHeader({ list }: PublicHeaderProps) {
    const bgColor = list.bannerBgColor || "#fdf2f8";
    const emojis = list.bannerEmojis || "";

    return (
        <header className="relative" style={{ backgroundColor: bgColor }}>
            {/* Background Pattern - subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.2),transparent_50%)]" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="text-center">
                    {/* Decorative Icon */}
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg mb-6 overflow-hidden">
                        {list.headerIconUrl ? (
                            <img
                                src={list.headerIconUrl}
                                alt="Icône de la liste"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-4xl">🎁</span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        {list.title}
                    </h1>

                    {/* Preamble */}
                    {list.preamble && (
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            {list.preamble}
                        </p>
                    )}

                    {/* Decorative Elements */}
                    {emojis && (
                        <div className="flex justify-center gap-2 mt-8">
                            {emojis.split("").map((emoji, index) => (
                                <span
                                    key={index}
                                    className="text-2xl animate-bounce"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {emoji}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
