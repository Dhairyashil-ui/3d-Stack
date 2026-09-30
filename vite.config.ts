import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-desktop-binaries',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && (req.url.startsWith('/dist-desktop') || req.url.startsWith('/downloads'))) {
            const cleanUrl = req.url.split('?')[0]
            const filename = decodeURIComponent(path.basename(cleanUrl))
            
            // Priority order: dist-desktop root -> public/dist-desktop -> public/downloads
            const candidatePaths = [
              path.resolve(__dirname, 'dist-desktop', filename),
              path.resolve(__dirname, 'public', 'dist-desktop', filename),
              path.resolve(__dirname, 'public', 'downloads', filename)
            ]

            for (const filePath of candidatePaths) {
              if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
                return fs.createReadStream(filePath).pipe(res)
              }
            }
          }
          next()
        })
      }
    }
  ],
})
