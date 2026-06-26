'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Locale } from '@/lib/i18n'

interface LocaleState {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: 'en',
      
      setLocale: (locale: Locale) => set({ locale }),
      
      toggleLocale: () => {
        const current = get().locale
        set({ locale: current === 'en' ? 'ar' : 'en' })
      },
    }),
    {
      name: 'kazuza-locale',
    }
  )
)
