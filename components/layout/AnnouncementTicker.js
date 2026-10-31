"use client";

const tickerMessages = [
  "NEW DROP: YUI COLLECTION",
  "10% OFF ARCHIVAL PIECES",
  "FREE GLOBAL DISPATCH ON ALL ORDERS OVER $200",
  "OKAYAMA RAW SELVAGE DENIM",
  "LIMITED RUN: 10 UNITS WORLDWIDE",
];

export default function AnnouncementTicker() {
  // Repeating block of messages
  const phrase = tickerMessages.map((msg) => `// ${msg} `).join("") + "// ";

  return (
    <div className="w-full overflow-hidden bg-meraki-black text-meraki-cream border-b border-meraki-black py-2 select-none">
      {/* Embedded CSS ensuring linear ticker keyframes run without caching delays */}
      <style>{`
        @keyframes announcementScroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .announcement-track {
          display: flex;
          width: max-content;
          animation: announcementScroll 20s linear infinite;
          will-change: transform;
        }
      `}</style>

      <div className="announcement-track flex w-max whitespace-nowrap font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest leading-none">
        <span className="shrink-0 pr-4">{phrase}</span>
        <span className="shrink-0 pr-4">{phrase}</span>
      </div>
    </div>
  );
}
