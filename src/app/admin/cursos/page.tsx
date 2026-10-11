export default function AdminCursos() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: "700", margin: 0 }}>Cursos (Vídeo Aulas)</h1>
          <p style={{ color: "#888", fontSize: "14px", margin: "8px 0 0" }}>Gerencie suas playlists do YouTube.</p>
        </div>
        <button style={{
          background: "linear-gradient(135deg, #4a9eff, #2563eb)",
          color: "#fff",
          fontWeight: "700",
          fontSize: "14px",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Importar Playlist
        </button>
      </div>

      <div style={{
        background: "linear-gradient(135deg, #0d1320, #0a1028)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        padding: "48px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎥</div>
        <h3 style={{ color: "#fff", fontSize: "18px", margin: "0 0 8px" }}>Cursos sincronizados</h3>
        <p style={{ color: "#777", fontSize: "14px", maxWidth: "400px", margin: "0 auto" }}>
          A integração com a API do YouTube está ativa.
        </p>
      </div>
    </div>
  );
}
