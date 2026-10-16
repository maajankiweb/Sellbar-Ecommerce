import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StorefrontLayoutWrapper from "@/components/layout/StorefrontLayoutWrapper";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0f172a",
};

export const metadata: Metadata = {
  title: "Sellbar — Sell Old Electronics for Instant Cash & Buy Refurbished",
  description: "India's trusted recommerce platform. Sell your old smartphone with transparent valuation and free doorstep pickup, or buy certified refurbished phones with verified warranty.",
  keywords: "sell old phone, buy refurbished phone, mobile buyback, sell iphone, refurbished smartphone",
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var cleanNode = function(node) {
                    if (!node || node.nodeType !== 1) return;
                    if (node.hasAttribute('bis_skin_checked')) node.removeAttribute('bis_skin_checked');
                    if (node.hasAttribute('bis_register')) node.removeAttribute('bis_register');
                  };
                  var cleanTree = function(root) {
                    if (!root || root.nodeType !== 1) return;
                    cleanNode(root);
                    var elements = root.querySelectorAll ? root.querySelectorAll('[bis_skin_checked], [bis_register]') : [];
                    for (var i = 0; i < elements.length; i++) {
                      cleanNode(elements[i]);
                    }
                  };
                  var observer = new MutationObserver(function(mutations) {
                    for (var i = 0; i < mutations.length; i++) {
                      var m = mutations[i];
                      if (m.type === 'attributes') {
                        if (m.attributeName === 'bis_skin_checked' || m.attributeName === 'bis_register') {
                          m.target.removeAttribute(m.attributeName);
                        }
                      } else if (m.type === 'childList') {
                        for (var j = 0; j < m.addedNodes.length; j++) {
                          cleanTree(m.addedNodes[j]);
                        }
                      }
                    }
                  });
                  observer.observe(document.documentElement, {
                    attributes: true,
                    subtree: true,
                    childList: true,
                    attributeFilter: ['bis_skin_checked', 'bis_register']
                  });
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.className} min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white`}
      >
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <StorefrontLayoutWrapper>
                {children}
              </StorefrontLayoutWrapper>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
