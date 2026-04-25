import './globals.css'
import Script from 'next/script'

export const metadata = {
  title: 'AI 학회 캘린더',
  description: 'AI 학회, 세미나, 컨퍼런스 일정을 한눈에 확인하세요',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Script
          src="https://identity.netlify.com/v1/netlify-identity-widget.js"
          strategy="afterInteractive"
        />
        <Script id="netlify-identity-redirect" strategy="afterInteractive">{`
          if (window.netlifyIdentity) {
            window.netlifyIdentity.on("init", function(user) {
              if (!user) {
                window.netlifyIdentity.on("login", function() {
                  document.location.href = "/admin/";
                });
              }
            });
          }
        `}</Script>
      </body>
    </html>
  )
}
