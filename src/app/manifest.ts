import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CSAD Rýmařov',
    short_name: 'CSAD',
    description: 'Interní a veřejný portál logistického areálu CSAD Rýmařov',
    start_url: '/',
    display: 'standalone',
    background_color: '#040814',
    theme_color: '#040814',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      }
    ],
  }
}
