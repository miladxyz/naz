'use client';

import { useState, useRef, useEffect } from 'react';

type LegalPath = 'free' | 'compelete' | 'help' | null;

interface PathNode {
  id: LegalPath;
  title: string;
  shortLabel: string;
  xPosition: number; // percentage from 0 to 100
}

const nodes: PathNode[] = [
  { id: 'free', title: '', shortLabel: 'مشاوره رایگان', xPosition: 88 },
  { id: 'help', title: '', shortLabel: 'همراه با موکل', xPosition: 50 },
  { id: 'compelete', title: '', shortLabel:'اعلام وکالت' , xPosition: 12 },
];

const adviceMap: Record<Exclude<LegalPath, null>, string> = {
  free: 'نخستین گام ما، برگزاری یک جلسه مشاوره رایگان جهت واکاوی جزییات پرونده و انطباق آن با قوانین موضوعه است. در این مرحله، با بررسی دقیق مستندات، «نقشه راه» به شما ارائه می‌شود. تجربه نشان داده است که بسیاری از پرونده‌ها صرفاً با دریافت یک راهنماییِ فنی و اصولی در همین مرحله مرتفع شده و مراجع شخصاً قادر به پیشبرد امور خود خواهد بود.',
    help: 'چنانچه پرونده نیاز به بررسی همه جانبه در مراحل بعدی داشته باشد و مراجع به تنهایی قادر به مدیریت چالش‌های فنی نباشد، اما به هر دلیلی (از جمله شرایط مالی یا ترجیح شخصی) امکان انعقاد قرارداد وکالت کامل (با حضور وکیل در جلسات) میسر نگردد، گزینه «همراه با موکل» پیش‌بینی شده است. در این مدل:وکیل به صورت مستمر بر روند پرونده نظارت دارد. تمامی اوراق قضایی اعم از دادخواست، شکواییه، لوایح دفاعیه و درخواست‌ها با بالاترین استانداردهای حقوقی توسط وکیل تنظیم می‌شود .تنها تفاوت این روش با وکالت کامل، عدم اعلام سمت رسمی وکیل در پرونده و عدم حضور فیزیکی در جلسات دادگاه است؛ اما مراجع در تمام مسیر، مسلح به دانش و قلم وکیل خواهد بود.',
  compelete:
    'در صورت توافق فی‌مابین و مهیا بودن شرایط برای تفویض وکالت رسمی، وکیل با اعلام سمت در پرونده، مسئولیت کاملِ حضور در محاکم، دفاع شفاهی و مدیریت مستقیم پروسه قضایی را بر عهده می‌گیرد. این گزینه برای مراجعینی است که مایل‌اند تمام مسئولیت پیگیری و دفاع در صحن دادگاه را به وکیل پایه یک دادگستری بسپارند.',
};

export default function HelpPage() {
  const [selectedPath, setSelectedPath] = useState<LegalPath>('free'); // default at DIY
  const [characterX, setCharacterX] = useState<number>(88); // matches default node
  const trackRef = useRef<HTMLDivElement>(null);

  const handleSelect = (pathId: LegalPath) => {
    if (!pathId) return;
    setSelectedPath(pathId);
    const node = nodes.find(n => n.id === pathId);
    if (node) {
      setCharacterX(node.xPosition);
    }
  };

  const handleProceed = () => {
    if (!selectedPath) {
      alert('Please select a legal path first.');
      return;
    }
    const modelName = nodes.find(n => n.id === selectedPath)?.title;
    alert(
      `🔍انتخاب شما: ${modelName}.\n\n با ما تماس بگیرید.`
    );
    // Optional redirect:
    // window.location.href = `/contact?path=${selectedPath}`;
  };
  return (
    <div style={{ background: '#070f1e', minHeight: '100vh' }}>

      {/* Header */}
      <section className="pt-24 pb-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: '#4cb4c9' }} />

        <div className="container-site relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-ivory mb-4 leading-tight">
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #4cb4c9, #a8dde8)' }}>
             طرح همراه با موکل
            </span>
          </h1>
          <p className="text-base max-w-xl mx-auto leading-relaxed mb-8"
            style={{ color: 'rgba(246,248,250,0.55)' }}>
            همراه و کنار شما در مسیر حقوقی
          </p>
          <div className="h-px max-w-2xl mx-auto" style={{ background: 'linear-gradient(90deg, transparent, #4cb4c9, transparent)' }} />
        </div>
      </section>
      {/* Main content: path + character */}
        <div className="p-6 md:p-8">
          {/* The "real path" track */}
          <div className="relative mb-16 mt-8" ref={trackRef}>
            {/* Background line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-teal rounded-full -translate-y-1/2" />
            {/* Colored progress line (optional) */}
            <div
              className="absolute top-1/2 left-0 h-1 bg-white rounded-full -translate-y-1/2 transition-all duration-500"
              style={{ width: `${characterX}%` }}
            />

            {/* Nodes (milestones) */}
            {nodes.map((node) => (
              <div
                key={node.id}
                className="absolute top-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: `${node.xPosition}%`, transform: 'translate(-50%, -50%)' }}
                onClick={() => handleSelect(node.id)}
              >
                <div
                  className={`w-8 h-8 rounded-full border-4 transition-all duration-200 ${
                    selectedPath === node.id
                      ? 'bg-teal border-navy shadow-lg scale-110'
                      : 'bg-white border-gray-400 hover:border-bone'
                  }`}
                />
                <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-gray-600 group-hover:text-amber-700 transition">
                  {node.shortLabel}
                </div>
              </div>
            ))}

            {/* Walking character (avatar) */}
            <div
              className="absolute bottom-8 transition-all duration-500 ease-in-out z-10"
              style={{ left: `${characterX}%`, transform: 'translateX(-50%)' }}
            >
              <div className="relative">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
  <svg
  xmlns="http://www.w3.org/2000/svg"
  width="87.581"
  height="109.535"
  viewBox="0 0 278.982 299.565"
>
  <g transform="translate(-68.997 -186.93)">
    <rect
      width="12.641"
      height="22.696"
      x="289.595"
      y="264.594"
      ry="6.321"
      fill="#4cb4c9"
      fillOpacity={1}
      stroke="none"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={4}
      strokeOpacity={1}
    />
    <rect
      width="12.641"
      height="22.696"
      x="117.5"
      y="263.445"
      ry="6.321"
      fill="#4cb4c9"
      fillOpacity={1}
      stroke="none"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={4}
      strokeOpacity={1}
    />
    <rect
      width="22.984"
      height="23.558"
      x="176.4"
      y="427.502"
      ry="6.321"
      fill="#4cb4c9"
      fillOpacity={1}
      stroke="none"
      strokeWidth={8}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={4}
      strokeOpacity={1}
    />
    <rect
      width="22.984"
      height="23.558"
      x="218.4"
      y="427.502"
      ry="6.321"
      fill="#4cb4c9"
      fillOpacity={1}
      stroke="none"
      strokeWidth={8}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={4}
      strokeOpacity={1}
    />
    <rect
      width="160"
      height="111.429"
      x="130"
      y="222.362"
      ry="31.429"
      fill="#c5c5c5"
      fillOpacity={1}
      stroke="none"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={4}
      strokeOpacity={1}
    />
    <rect
      width="97.143"
      height="99.731"
      x="160.286"
      y="329.791"
      ry="14.384"
      fill="#c5c5c5"
      fillOpacity={1}
      stroke="none"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={4}
      strokeOpacity={1}
    />
    <ellipse
      cx="172.5"
      cy="268.505"
      rx="7.5"
      ry="7.143"
      fill="#000"
      fillOpacity={1}
      stroke="none"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={4}
      strokeOpacity={1}
    />
    <ellipse
      cx="244.5"
      cy="268.505"
      rx="7.5"
      ry="7.143"
      fill="#000"
      fillOpacity={1}
      stroke="none"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={4}
      strokeOpacity={1}
    />
    <path
      d="M225.575 280.706c-1.42 14.712-32.43 15.287-34.285 0"
      fill="none"
      fillRule="evenodd"
      stroke="#000"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={4}
      strokeOpacity={1}
    />
    <ellipse
      cx="158.157"
      cy="286.285"
      rx="5.89"
      ry="3.017"
      fill="#4cb4c9"
      fillOpacity={1}
      stroke="none"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={4}
      strokeOpacity={1}
    />
    <ellipse
      cx="252.157"
      cy="286.285"
      rx="5.89"
      ry="3.017"
      fill="#4cb4c9"
      fillOpacity={1}
      stroke="none"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={4}
      strokeOpacity={1}
    />
    <rect
      width="17.238"
      height="25.282"
      x="144.798"
      y="350.208"
      ry="7.47"
      fill="#c5c5c5"
      fillOpacity={1}
      stroke="none"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={4}
      strokeOpacity={1}
    />
    <rect
      width="17.238"
      height="25.282"
      x="128.798"
      y="350.208"
      ry="7.47"
      fill="#c5c5c5"
      fillOpacity={1}
      stroke="none"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={4}
      strokeOpacity={1}
    />
    <rect
      width="17.238"
      height="25.282"
      x="270.798"
      y="350.208"
      ry="7.47"
      fill="#c5c5c5"
      fillOpacity={1}
      stroke="none"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={4}
      strokeOpacity={1}
    />
    <rect
      width="17.238"
      height="25.282"
      x="254.798"
      y="350.208"
      ry="7.47"
      fill="#c5c5c5"
      fillOpacity={1}
      stroke="none"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={4}
      strokeOpacity={1}
    />
    <path
      d="M108.487 347.789c26.23 1.381 27.255 28.08 0 29.884m200.002-29.884c-26.23 1.381-27.255 28.08 0 29.884"
      fill="none"
      fillRule="evenodd"
      stroke="#c5c5c5"
      strokeWidth={8}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={4}
      strokeOpacity={1}
    />
    <path
      d="m209.727 399.623 18.387-18.961c1.54-1.589 3.075-3.207 4.252-5.08s1.986-4 2.173-6.206a11.7 11.7 0 0 0-1.29-6.42c-1.035-1.956-2.645-3.596-4.56-4.703-1.991-1.151-4.301-1.728-6.6-1.709-2.3.02-4.585.63-6.616 1.709a15.35 15.35 0 0 0-6.32 6.32 19.7 19.7 0 0 0-7.47-5.746c-2.086-.915-4.344-1.464-6.621-1.5s-4.575.448-6.595 1.5c-1.958 1.02-3.642 2.578-4.746 4.488a11.05 11.05 0 0 0-1.433 6.361c.175 2.2 1.02 4.319 2.262 6.143 1.242 1.825 2.865 3.351 4.491 4.843z"
      fill="#4cb4c9"
      fillOpacity={1}
      fillRule="evenodd"
      stroke="#4cb4c9"
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={4}
      strokeOpacity={1}
    />
  </g>
</svg>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-amber-700 whitespace-nowrap">
                  {selectedPath ? nodes.find(n => n.id === selectedPath)?.title : 'Choose a step'}
                </div>
              </div>
            </div>
          </div>

          {/* Speech bubble & cards side by side for better UX */}
          <div className="flex flex-col lg:flex-row gap-8 mt-[120px]">

            {/* Right: 3 cards (clickable) */}
            <div className="w-screen z-10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  onClick={() => handleSelect('free')}
                  className={`cursor-pointer rounded-xl p-4 transition-all border ${
                    selectedPath === 'free'
                      ? 'border-l-8 border-l-teal bg-bone shadow-md'
                      : 'border-gray-200 bg-white hover:shadow-md'
                  }`}
                >
                  <div className="text-2xl">📄</div>
                  <div className="font-bold text-navy">مشاوره رایگان</div>
                  <div className="text-xs text-gray-500 mt-1">رایگان</div>
                  <div className="text-xs text-amber-700 mt-2">مناسب برای:  دریافت مشاوره</div>
                </div>
                
                <div
                  onClick={() => handleSelect('help')}
                  className={`cursor-pointer rounded-xl p-4 transition-all border ${
                    selectedPath === 'help'
                      ? 'border-l-8 border-l-teal bg-bone shadow-md'
                      : 'border-gray-200 bg-white hover:shadow-md'
                  }`}
                >
                  <div className="text-2xl">⚖️</div>
                  <div className="font-bold text-navy">همراه با موکل</div>
                  <div className="text-xs text-gray-500 mt-1">همراه شما در مسیر حقوقی</div>
                  <div className="text-xs text-amber-700 mt-2">مناسب برای: افرادی که نیاز به همراهی دارند</div>
                </div>
                <div
                  onClick={() => handleSelect('compelete')}
                  className={`cursor-pointer rounded-xl p-4 transition-all border ${
                    selectedPath === 'compelete'
                      ? 'border-l-8 border-l-teal bg-bone shadow-md'
                      : 'border-gray-200 bg-white hover:shadow-md'
                  }`}
                >
                  <div className="text-2xl">📋</div>
                  <div className="font-bold text-navy">اعلام وکالت</div>
                  <div className="text-xs text-gray-500 mt-1">حق‌الوکاله پس از اتمام پرونده</div>
                  <div className="text-xs text-amber-700 mt-2">مناسب برای: وکالت کامل</div>
                </div>
              </div>
            </div>
          </div>
                      {/* Left: Speech bubble */}
            <div className="w-[50%] bg-silver rounded-2xl p-5 border border-gray-100 shadow-sm mt-12">
              <div className="flex items-start gap-3">
                <div className="text-3xl">👩‍⚖️</div>
                <div className="flex-1">
                  <div className="font-bold text-gold text-lg">دستیار حقوقی شما</div>
                  <div className="text-bone text-sm leading-relaxed mt-2">
                    {selectedPath ? (
                      <span>{adviceMap[selectedPath]}</span>
                    ) : (
                      "، در راستای احقاق حقوق شما و با هدف تسهیل دسترسی به خدمات تخصصی حقوقی، مسیرهای حل مشکل در این مجموعه به گونه‌ای طراحی شده است که هیچ پرونده‌ای به دلیل پیچیدگی یا محدودیت‌های مالی، از دایره حمایت تخصصی خارج نماند. ما متعهد هستیم که از یکی از سه طریق زیر، بن‌بست‌های حقوقی شما را مرتفع سازیم:"
                    )}
                  </div>
                </div>
              </div>
            </div>
          <div className="mt-10 text-center z-10">
            <button
              onClick={handleProceed}
              className="bg-navy hover:bg-gold text-white font-semibold py-3 px-8 rounded-full transition-all shadow-md text-base z-10"
            >
              این مسیر را انتخاب میکنید؟ →
            </button>
            <p className="text-gray-400 text-xs mt-4">
            خدمات مناسب خود را انتخاب کنید
            </p>
          </div>
        </div>
    </div>
  )
}
