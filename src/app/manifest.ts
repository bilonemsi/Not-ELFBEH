
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Not-ELFBEH Markdown Notes',
    short_name: 'Not-ELFBEH',
    description: 'A professional and clean Markdown note-taking experience.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#1e40af',
    icons: [
      {
        src: 'https://picsum.photos/seed/not-elfbeh-icon/192/192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'https://picsum.photos/seed/not-elfbeh-icon-512/512/512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
