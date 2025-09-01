// Configuración única para el embed de Farcaster Mini App
export const farcasterEmbedConfig = {
  version: "1",
  imageUrl: "https://re-mi.vercel.app/hero.png",
  button: {
    title: "🚀 Abrir ReMi",
    action: {
      type: "launch_miniapp",
      url: "https://re-mi.vercel.app",
    },
  },
} as const;

// Función para obtener el JSON serializado
export function getFarcasterEmbedJSON() {
  return JSON.stringify(farcasterEmbedConfig);
}
