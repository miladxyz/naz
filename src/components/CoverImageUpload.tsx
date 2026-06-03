'use client'

import { useRef, useState } from 'react'
import { ImageIcon, X, Upload } from 'lucide-react'

interface CoverImageUploadProps {
  value?: string        // base64 or URL
  onChange: (base64: string) => void
}

export function CoverImageUpload({ value, onChange }: CoverImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result as string)
    reader.readAsDataURL(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  if (value) {
    return (
      <div className="relative group">
        <div className="relative w-full h-48 overflow-hidden"
          style={{ border: '1px solid rgba(76,180,201,0.3)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="تصویر شاخص" className="w-full h-full object-cover" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3"
            style={{ background: 'rgba(7,15,30,0.7)' }}>
            <button type="button" onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all"
              style={{ background: '#4cb4c9' }}>
              <Upload size={14} /> تغییر تصویر
            </button>
            <button type="button" onClick={() => onChange('')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all"
              style={{ border: '1px solid rgba(246,248,250,0.3)', color: '#f6f8fa' }}>
              <X size={14} /> حذف
            </button>
          </div>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      </div>
    )
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className="flex flex-col items-center justify-center gap-3 h-36 cursor-pointer transition-all duration-200"
      style={{
        border: `2px dashed ${dragging ? '#4cb4c9' : 'rgba(36,61,106,0.8)'}`,
        background: dragging ? 'rgba(76,180,201,0.05)' : 'rgba(13,31,60,0.4)',
      }}>
      <div className="w-12 h-12 flex items-center justify-center"
        style={{ background: 'rgba(76,180,201,0.1)', border: '1px solid rgba(76,180,201,0.2)' }}>
        <ImageIcon size={22} style={{ color: '#4cb4c9' }} />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-ivory">
          {dragging ? 'رها کنید...' : 'کلیک کنید یا فایل را اینجا بکشید'}
        </p>
        <p className="text-xs mt-1" style={{ color: 'rgba(246,248,250,0.35)' }}>
          PNG، JPG، WebP — حداکثر ۵ مگابایت
        </p>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  )
}
