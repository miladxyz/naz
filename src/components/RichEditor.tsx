'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import CharacterCount from '@tiptap/extension-character-count'
import { useCallback, useRef } from 'react'
import {
  Bold, Italic, UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus,
  AlignRight, AlignCenter, AlignLeft, AlignJustify,
  Link2, Image as ImageIcon, Undo, Redo,
  Code, RemoveFormatting
} from 'lucide-react'

interface RichEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  onImageUpload?: (file: File) => Promise<string>
}

type ToolbarButton = {
  icon: React.ReactNode
  title: string
  action: () => void
  active?: boolean
  disabled?: boolean
} | 'separator'

export function RichEditor({ value, onChange, placeholder, onImageUpload }: RichEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextStyle,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'right',
      }),
      Image.configure({
        HTMLAttributes: { class: 'max-w-full h-auto my-4 rounded' },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-teal underline cursor-pointer' },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'محتوای مقاله را اینجا بنویسید...',
      }),
      CharacterCount,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[280px] px-4 py-3 text-sm leading-8 text-ivory',
        dir: 'rtl',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Image insert handler
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return
    e.target.value = ''

    let src = ''
    if (onImageUpload) {
      src = await onImageUpload(file)
    } else {
      // Fallback: base64 embed (works offline, no server needed)
      src = await new Promise<string>(resolve => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })
    }
    if (src) editor.chain().focus().setImage({ src }).run()
  }, [editor, onImageUpload])

  // Insert link
  const insertLink = useCallback(() => {
    const url = window.prompt('آدرس لینک را وارد کنید:')
    if (!url || !editor) return
    if (editor.state.selection.empty) {
      editor.chain().focus().setLink({ href: url }).run()
    } else {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  if (!editor) return null

  const toolbarGroups: ToolbarButton[][] = [
    // History
    [
      { icon: <Undo size={15} />, title: 'برگشت', action: () => editor.chain().focus().undo().run(), disabled: !editor.can().undo() },
      { icon: <Redo size={15} />, title: 'انجام مجدد', action: () => editor.chain().focus().redo().run(), disabled: !editor.can().redo() },
    ],
    // Text format
    [
      { icon: <Bold size={15} />,          title: 'بولد (Ctrl+B)',    action: () => editor.chain().focus().toggleBold().run(),          active: editor.isActive('bold') },
      { icon: <Italic size={15} />,        title: 'ایتالیک (Ctrl+I)', action: () => editor.chain().focus().toggleItalic().run(),        active: editor.isActive('italic') },
      { icon: <UnderlineIcon size={15} />, title: 'خط زیر (Ctrl+U)', action: () => editor.chain().focus().toggleUnderline().run(),     active: editor.isActive('underline') },
      { icon: <Strikethrough size={15} />, title: 'خط روی',           action: () => editor.chain().focus().toggleStrike().run(),        active: editor.isActive('strike') },
      { icon: <Code size={15} />,          title: 'کد',                action: () => editor.chain().focus().toggleCode().run(),          active: editor.isActive('code') },
    ],
    // Headings
    [
      { icon: <Heading1 size={15} />, title: 'عنوان ۱', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
      { icon: <Heading2 size={15} />, title: 'عنوان ۲', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
      { icon: <Heading3 size={15} />, title: 'عنوان ۳', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }) },
    ],
    // Lists & blocks
    [
      { icon: <List size={15} />,          title: 'لیست',         action: () => editor.chain().focus().toggleBulletList().run(),  active: editor.isActive('bulletList') },
      { icon: <ListOrdered size={15} />,   title: 'لیست عددی',   action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList') },
      { icon: <Quote size={15} />,         title: 'نقل قول',      action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
      { icon: <Minus size={15} />,         title: 'خط افقی',      action: () => editor.chain().focus().setHorizontalRule().run() },
    ],
    // Alignment (RTL: right is default)
    [
      { icon: <AlignRight size={15} />,   title: 'راست‌چین',    action: () => editor.chain().focus().setTextAlign('right').run(),   active: editor.isActive({ textAlign: 'right' }) },
      { icon: <AlignCenter size={15} />,  title: 'وسط‌چین',    action: () => editor.chain().focus().setTextAlign('center').run(),  active: editor.isActive({ textAlign: 'center' }) },
      { icon: <AlignLeft size={15} />,    title: 'چپ‌چین',     action: () => editor.chain().focus().setTextAlign('left').run(),    active: editor.isActive({ textAlign: 'left' }) },
      { icon: <AlignJustify size={15} />, title: 'دوطرفه',      action: () => editor.chain().focus().setTextAlign('justify').run(), active: editor.isActive({ textAlign: 'justify' }) },
    ],
    // Insert
    [
      { icon: <Link2 size={15} />,    title: 'لینک',  action: insertLink,                                 active: editor.isActive('link') },
      { icon: <ImageIcon size={15} />, title: 'تصویر', action: () => fileInputRef.current?.click() },
      { icon: <RemoveFormatting size={15} />, title: 'حذف فرمت', action: () => editor.chain().focus().clearNodes().unsetAllMarks().run() },
    ],
  ]

  const charCount = editor.storage.characterCount?.characters?.() ?? 0
  const wordCount = editor.storage.characterCount?.words?.() ?? 0

  return (
    <div className="flex flex-col" style={{ border: '1px solid rgba(22,45,82,0.8)', background: 'rgba(13,31,60,0.6)' }}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b overflow-x-auto"
        style={{ borderColor: 'rgba(22,45,82,0.8)', background: 'rgba(7,15,30,0.6)' }}>
        {toolbarGroups.map((group, gi) => (
          <div key={gi} className="flex items-center gap-0.5">
            {group.map((btn, bi) => {
              if (typeof btn === 'string') return null
              return (
                <button
                  key={bi}
                  type="button"
                  title={btn.title}
                  disabled={btn.disabled}
                  onClick={btn.action}
                  className={`p-1.5 transition-all duration-150 rounded-sm disabled:opacity-30 ${
                    btn.active
                      ? 'text-white'
                      : 'text-ivory/50 hover:text-ivory'
                  }`}
                  style={btn.active ? { background: '#4cb4c9' } : undefined}
                >
                  {btn.icon}
                </button>
              )
            })}
            {gi < toolbarGroups.length - 1 && (
              <div className="w-px h-5 mx-1 flex-shrink-0" style={{ background: 'rgba(22,45,82,0.8)' }} />
            )}
          </div>
        ))}
      </div>

      {/* Editor area */}
      <div className="flex-1" dir="rtl">
        <EditorContent editor={editor} />
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t text-xs"
        style={{ borderColor: 'rgba(22,45,82,0.8)', color: 'rgba(246,248,250,0.3)' }}>
        <span>{charCount} کاراکتر · {wordCount} کلمه</span>
        <span>Ctrl+B بولد · Ctrl+I ایتالیک · Ctrl+U خط‌زیر</span>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  )
}
