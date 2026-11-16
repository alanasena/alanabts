// Ícones de linha (lucide) no lugar dos emojis
import {
  CalendarHeart, Camera, Disc3, FerrisWheel, Headphones, Heart, Home, Lightbulb, Lock, Mic,
  MoonStar, Newspaper, PenLine, Play, Shirt, ShoppingBag, Sparkles, Star, Tv, type LucideIcon,
} from "lucide-react";

const ICONES: Record<string, LucideIcon> = {
  inicio: Home, noticias: Newspaper, astrologia: MoonStar, sobre: Heart, blog: PenLine, album: Camera,
  wishlist: ShoppingBag, consumo: Headphones, favoritos: Tv, bonequinha: Shirt, roletas: FerrisWheel,
  ideias: Lightbulb, calendario: CalendarHeart, metas: Star, cadeado: Lock, disco: Disc3, play: Play,
  podcast: Mic, brilho: Sparkles,
};

export default function Icone({ nome, tamanho = 16, traco = 1.8, className }: { nome: string; tamanho?: number; traco?: number; className?: string }) {
  const I = ICONES[nome] ?? Sparkles;
  return <I size={tamanho} strokeWidth={traco} className={className} aria-hidden />;
}
