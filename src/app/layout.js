import './globals.css'

export const metadata = {
  title: 'Fresh Sequence Builder',
  description: 'Create personalized email sequences for partnership outreach',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}