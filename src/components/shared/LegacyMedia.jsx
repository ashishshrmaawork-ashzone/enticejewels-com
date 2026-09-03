import Image from "next/image";

function youtubeEmbed(url) {
  const match = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&?/]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}&controls=1&rel=0&playsinline=1` : "";
}

export default function LegacyMedia({ media, fallbackVideo = "/videos/legacy.mp4", title = "Entice Jewels legacy media" }) {
  const type = media?.type || "hosted";
  const url = media?.url || fallbackVideo;
  if (type === "image") return <div className="relative aspect-video w-full"><Image src={url} alt={media.image_alt || title} fill unoptimized className="object-cover" /></div>;
  if (type === "youtube") {
    const embedUrl = youtubeEmbed(url);
    if (embedUrl) return <iframe src={embedUrl} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="block aspect-video w-full border-0" />;
  }
  return <video autoPlay muted loop playsInline controls className="block aspect-video w-full object-cover"><source src={type === "youtube" ? fallbackVideo : url} />Your browser does not support HTML video.</video>;
}
