export default function AdminAlunos() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: "700", margin: 0 }}>Alunos</h1>
        <p style={{ color: "#888", fontSize: "14px", margin: "8px 0 0" }}>Base de usuários cadastrados na plataforma.</p>
      </div>

      <div style={{
        background: "linear-gradient(135deg, #0d1320, #0a1028)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        padding: "48px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>👥</div>
        <h3 style={{ color: "#fff", fontSize: "18px", margin: "0 0 8px" }}>Gestão de Alunos</h3>
        <p style={{ color: "#777", fontSize: "14px", maxWidth: "400px", margin: "0 auto" }}>
          Em breve você poderá ver o progresso e os acessos de cada aluno aqui.
        </p>
      </div>
    </div>
  );
}
