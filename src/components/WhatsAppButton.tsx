'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

const WHATSAPP_NUMBER = '989120310806'
const WHATSAPP_MESSAGE = encodeURIComponent('سلام، می‌خواستم در مورد یک موضوع حقوقی مشاوره بگیرم.')

export default function WhatsAppButton() {
  const [tooltip, setTooltip] = useState(true)

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">

      {/* Tooltip */}
      {tooltip && (
        <div className="flex items-center gap-2 bg-white text-gray-800 text-xs font-medium px-3 py-2 shadow-lg rounded-sm animate-fade-in">
          مشاوره رایگان با وکیل
          <button onClick={() => setTooltip(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={12} />
          </button>
        </div>
      )}

      {/* Button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setTooltip(false)}
        aria-label="تماس از طریق واتساپ"
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
        style={{ background: '#25D366' }}
      >
        {/* WhatsApp SVG icon */}
        <svg viewBox="0 0 24 24" fill="white" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.523 5.845L.057 23.882a.5.5 0 0 0 .614.612l6.112-1.557A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 0 1-5.031-1.371l-.36-.214-3.733.952.99-3.648-.235-.374A9.861 9.861 0 0 1 2.1 12C2.1 6.534 6.534 2.1 12 2.1c5.466 0 9.9 4.434 9.9 9.9 0 5.466-4.434 9.9-9.9 9.9z"/>
        </svg>
      </a>
    </div>
  )
}