'use client'

type Service = {
  id: number;
  title: string;
  subtitle: string;     // the "video subtitle" – bold, descriptive
};

const services: Service[] = [
  { id: 1, title: 'تغیر نام', subtitle: '' },
  { id: 2, title: 'وکیل چک', subtitle: '' },
  { id: 3, title: 'وکیل خانواده', subtitle: '' },
  { id: 4, title: 'تغیر نام', subtitle: '' },
  { id: 5, title: 'وکیل چک', subtitle: '' },
  { id: 6, title: 'وکیل خانواده', subtitle: '' },
  { id: 7, title: 'تغیر نام', subtitle: '' },
  { id: 8, title: 'وکیل چک', subtitle: '' },
  { id: 9, title: 'وکیل خانواده', subtitle: '' },
  { id: 10, title: 'تغیر نام', subtitle: '' },
  { id: 11, title: 'وکیل چک', subtitle: '' },
  { id: 12, title: 'وکیل خانواده', subtitle: '' },
  { id: 13, title: 'تغیر نام', subtitle: '' },
  { id: 14, title: 'وکیل چک', subtitle: '' },
  { id: 15, title: 'وکیل خانواده', subtitle: '' },
  { id: 16, title: 'تغیر نام', subtitle: '' },
  { id: 17, title: 'وکیل چک', subtitle: '' },
  { id: 18, title: 'وکیل خانواده', subtitle: '' },
];

// Duplicate the array to create seamless infinite loop
const duplicatedServices = [...services, ...services];

export const VideoSubtitlesMarquee = () => {
  return (
    <section className="w-full bg-navy/10 overflow-hidden">
      <div className="relative w-full">
        {/* Scrolling container */}
        <div className="marquee-track flex whitespace-nowrap animate-marquee hover:pause-animation">
          {duplicatedServices.map((service, idx) => (
            <div
              key={`${service.id}-${idx}`}
              className="inline-flex flex-col mx-6 px-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border-l-4 border-cyan-400 shadow-lg"
              style={{ minWidth: '280px' }}
            >
              {/* Main title – like video headline */}
              <span className="text-cyan-300 text-xs uppercase tracking-wider font-semibold">● خدمات</span>
              <span className="h-[10px]">{service.title}</span>
              {/* VIDEO SUBTITLE – the core element */}
              <span className="text-gray-200 text-sm md:text-base font-medium mt-1 opacity-90">
                {service.subtitle}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          display: flex;
          animation: marquee 200s linear infinite;
          width: max-content;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        /* Pause animation helper */
        .pause-animation {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default VideoSubtitlesMarquee;