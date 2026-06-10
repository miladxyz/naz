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
  free: 'شما  میتوانید صرفا با دریافت مشاوره حرفه ای رایگان کمک بگیرید',
    help:
    'شما میتوانید بدون اعلام وکالت در مسیر حقوقی خود همراهی داشته باشید',
  compelete:
    ' شما  با اعلام وکالت از از اول تا انتهای مسیر در حل پرونده حقوقی وکیل متخصص همراه دارید',

};

export default function HelpPage() {
  const [selectedPath, setSelectedPath] = useState<LegalPath>('free'); // default at DIY
  const [characterX, setCharacterX] = useState<number>(12); // matches default node
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
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 rounded-full -translate-y-1/2" />
            {/* Colored progress line (optional) */}
            <div
              className="absolute top-1/2 left-0 h-1 bg-teal rounded-full -translate-y-1/2 transition-all duration-500"
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
                  width="64"
                  height="64"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-md"
                >
                  <circle cx="50" cy="45" r="22" fill="#D9C49B" stroke="#B68B40" strokeWidth="1.5" />
                  <circle cx="40" cy="40" r="2.5" fill="#2C3E50" />
                  <circle cx="60" cy="40" r="2.5" fill="#2C3E50" />
                  <path d="M46 51 Q50 56 54 51" stroke="#5A3E1B" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                  <rect x="44" y="66" width="12" height="18" fill="#1E3A5F" rx="2" />
                  <path d="M40 68 L60 68 L62 84 L38 84 Z" fill="#1E3A5F" />
                  <path d="M34 72 L40 70 L40 74 L34 76Z" fill="#B68B40" />
                  <path d="M66 72 L60 70 L60 74 L66 76Z" fill="#B68B40" />
                  <path d="M48 86 L52 86 L53 92 L47 92Z" fill="#B68B40" />
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
                  <div className="font-bold text-[#c9a84c] text-lg">عسل، دستیار حقوقی شما</div>
                  <div className="text-bone text-sm leading-relaxed mt-2">
                    {selectedPath ? (
                      <span>{adviceMap[selectedPath]}</span>
                    ) : (
                      "Click any milestone on the path or card below — I'll walk with you and explain each model."
                    )}
                  </div>
                </div>
              </div>
            </div>
          <div className="mt-10 text-center z-10">
            <button
              onClick={handleProceed}
              className="bg-[#0a1c2f] hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-full transition-all shadow-md text-base z-10"
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
