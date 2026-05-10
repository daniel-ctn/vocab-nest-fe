'use client'

import { useState, useCallback } from 'react'
import { Volume2 } from 'lucide-react'

export function SpeakButton({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const [speaking, setSpeaking] = useState(false)

  const handleSpeak = useCallback(() => {
    if (!('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [text])

  if (!('speechSynthesis' in window)) return null

  return (
    <button
      onClick={handleSpeak}
      className={
        className ||
        'p-2 rounded-lg text-ink-secondary hover:text-accent hover:bg-accent-subtle transition-colors'
      }
      title="Listen"
      aria-label={`Listen to ${text}`}
    >
      <Volume2
        size={18}
        className={speaking ? 'animate-pulse text-accent' : ''}
      />
    </button>
  )
}
