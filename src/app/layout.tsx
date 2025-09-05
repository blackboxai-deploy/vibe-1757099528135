import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TypeSpeed Racer - Type Fast, Race Faster!',
  description: 'A competitive typing race game where your typing speed controls your race car. Challenge friends in tournaments or practice against AI opponents.',
  keywords: 'typing game, racing, multiplayer, tournament, typing speed, WPM',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}