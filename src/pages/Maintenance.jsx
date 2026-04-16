import { useState } from "react";
import Header    from "../components/header";
import Card      from "../components/Card";
import Footer    from "../components/footer";
import retentionData from "../database/Retention";
import tableData     from "../database/Table";
import C             from "../theme/palette";

const statusBadge = (s) => ({
  overdue:  { bg: "#fde8e6", color: C.red,     label: "Overdue"  },
  upcoming: { bg: "#fff8e1", color: "#7a5c00", label: "Upcoming" },
  done:     { bg: "#e8f5d5", color: C.greenD,  label: "Done"     },
}[s]);

const priorityColor = (p) => ({ high: C.red, medium: C.brown, low: C.green }[p]);

export default function Maintenance() {
  const [filter, setFilter] = useState("all");

  const counts = {
    overdue:  retentionData.filter(t => t.status === "overdue").length,
    upcoming: retentionData.filter(t => t.status === "upcoming").length,
    done:     retentionData.filter(t => t.status === "done").length,
  };

  const filtered = filter === "all"
    ? retentionData
    : retentionData.filter(t => t.status === filter);

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <Header title="🔧 Maintenance" subtitle="System operation data & scheduled upkeep" bg={C.brown} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem 1rem" }}>

        {/* Summary cards */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "1rem", marginBottom: "1.5rem",
        }}>
          {[
            { label: "Overdue",   count: counts.overdue,  color: C.red,     bg: "#fde8e6" },
            { label: "Upcoming",  count: counts.upcoming, color: "#7a5c00", bg: "#fff8e1" },
            { label: "Completed", count: counts.done,     color: C.greenD,  bg: "#e8f5d5" },
          ].map(c => (
            <Card key={c.label} style={{ textAlign: "center" }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%", background: c.bg,
                margin: "0 auto 10px", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 22, fontWeight: 700, color: c.color,
              }}>{c.count}</div>
              <div style={{ color: C.muted, fontSize: 13 }}>{c.label} Tasks</div>
            </Card>
          ))}
        </div>

        {/* Task list */}
        <Card style={{ marginBottom: "1.5rem" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 8, marginBottom: "1rem",
          }}>
            <h3 style={{ color: C.greenD, fontFamily: "'Georgia', serif", margin: 0, fontSize: 16 }}>
              Maintenance Schedule
            </h3>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["all", "overdue", "upcoming", "done"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  background: filter === f ? C.brown : C.cream,
                  color: filter === f ? "#fff" : C.muted,
                  border: "none", padding: "5px 12px", borderRadius: 20,
                  fontSize: 12, cursor: "pointer", textTransform: "capitalize",
                  transition: "all .15s",
                }}>{f}</button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map(t => {
              const badge = statusBadge(t.status);
              return (
                <div key={t.id} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px", borderRadius: 8, background: C.cream, flexWrap: "wrap",
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: priorityColor(t.priority), flexShrink: 0,
                  }} />
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ color: C.text, fontSize: 14, fontWeight: 500 }}>{t.task}</div>
                    <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>Due: {t.due}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                    <span style={{
                      fontSize: 11, padding: "3px 8px", borderRadius: 10,
                      background: badge.bg, color: badge.color, fontWeight: 600,
                    }}>{badge.label}</span>
                    <span style={{
                      fontSize: 11, padding: "3px 8px", borderRadius: 10,
                      background: "#f0f0f0", color: C.muted, textTransform: "capitalize",
                    }}>{t.priority}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Live operation data */}
        <Card>
          <h3 style={{ color: C.greenD, fontFamily: "'Georgia', serif", margin: "0 0 1rem", fontSize: 16 }}>
            ⚙️ Live Operation Data
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
            {tableData.map(o => (
              <div key={o.metric} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 16px", background: C.cream, borderRadius: 8,
                border: `1px solid ${o.status === "warning" ? C.gold : C.creamD}`,
              }}>
                <div>
                  <div style={{ color: C.muted, fontSize: 11, marginBottom: 2 }}>{o.metric}</div>
                  <div style={{ color: C.text, fontSize: 15, fontWeight: 700, fontFamily: "'Georgia', serif" }}>{o.value}</div>
                </div>
                <span style={{
                  fontSize: 11, padding: "3px 8px", borderRadius: 10, fontWeight: 600,
                  background: o.status === "warning" ? "#fff3cd" : "#e8f5d5",
                  color:      o.status === "warning" ? "#7a5c00" : C.greenD,
                }}>{o.status === "warning" ? "⚠ High" : "✓ OK"}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
