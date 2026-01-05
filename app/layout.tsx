import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Padel Club',
  description: 'Padel club',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {process.env.MONGODB_URI ? null : (
          <div className="w-full bg-yellow-50 border-b border-yellow-200 text-yellow-900 py-2 text-center text-sm z-60">
            <strong>Warning:</strong> MONGODB_URI is not set — database features are disabled. You can still view the UI but some features will be disabled until you set the environment variables.
          </div>
        )}
        {children}
        <Analytics />
      </body>
    </html>
  )
}
