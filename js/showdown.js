// Importa a biblioteca Showdown a partir de um CDN confiável
import "https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js";

// Cria e exporta uma instância do conversor de Markdown para HTML
export const converter = new showdown.Converter();
