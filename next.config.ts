import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // O indicador padrão (bottom-left) ficava em cima do rodapé da sidebar.
  devIndicators: {
    position: "bottom-right",
  },
};

export default nextConfig;
