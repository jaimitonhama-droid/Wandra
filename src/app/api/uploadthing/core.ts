import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// Aqui configuramos as "caixas" que vão receber os arquivos
export const ourFileRouter = {
  
  // Rota 1: Apenas Imagens (Para as capas dos e-books)
  imageUploader: f(
    { image: { maxFileSize: "4MB", maxFileCount: 1 } },
    { awaitServerData: false, presignedURLTTL: "1d" }
  )
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Capa do livro enviada com sucesso:", file.url);
      return { fileUrl: file.url };
    }),

  // Rota 2: Apenas PDFs (Para o conteúdo dos e-books)
  pdfUploader: f(
    { pdf: { maxFileSize: "32MB", maxFileCount: 1 } },
    { awaitServerData: false, presignedURLTTL: "1d" }
  )
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("PDF do livro enviado com sucesso:", file.url);
      return { fileUrl: file.url };
    }),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
