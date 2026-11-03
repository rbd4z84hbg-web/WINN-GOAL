
export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    };
    const send = (data, status = 200) =>
      new Response(JSON.stringify(data), { status, headers: cors });

    if (request.method === "OPTIONS")
      return new Response(null, { status: 204, headers: cors });

    if (!env.API_FOOTBALL_KEY)
      return send({ error: "API anahtarı tanımlı değil" }, 500);

    const url = new URL(request.url);
    const path = url.pathname;
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Istanbul",
      year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(new Date());
    const part = x => parts.find(p => p.type === x).value;
    const date = `${part("year")}-${part("month")}-${part("day")}`;

    async function api(endpoint) {
      const r = await fetch("https://v3.football.api-sports.io/" + endpoint, {
        headers: { "x-apisports-key": env.API_FOOTBALL_KEY }
      });
      const d = await r.json();
      if (!r.ok || Object.keys(d.errors || {}).length)
        throw Error(JSON.stringify(d.errors || r.status));
      return d.response || [];
    }

    const map = m => ({
      id: m.fixture.id,
      league: m.league.name,
      country: m.league.country,
      home: m.teams.home.name,
      away: m.teams.away.name,
      homeGoals: m.goals.home,
      awayGoals: m.goals.away,
      minute: m.fixture.status.elapsed,
      status: m.fixture.status.short,
      kickoff: m.fixture.date,
      events: m.events || []
    });

    try {
      if (path === "/") return send({
        app: "WINN GOAL",
        status: "active",
        endpoints: ["/matches", "/today", "/upcoming", "/signals?fixture=123"]
      });

      if (path === "/signals") {
        const id = url.searchParams.get("fixture");
        if (!/^\d+$/.test(id || ""))
          return send({ error: "Geçerli maç ID gerekli" }, 400);

        const data = await api("fixtures/statistics?fixture=" + id);
        const statistics = data.map(t => {
          const val = type => t.statistics.find(s => s.type === type)?.value ?? 0;
          return {
            team: t.team.name,
            totalShots: val("Total Shots"),
            shotsOnGoal: val("Shots on Goal"),
            corners: val("Corner Kicks"),
            possession: val("Ball Possession")
          };
        });

        const sum = k => statistics.reduce((n, t) => n + (Number(t[k]) || 0), 0);
        let signal = "İstatistik verisi yok";
        if (statistics.length === 2) {
          signal = "DÜŞÜK GOL BASKISI";
          if (sum("shotsOnGoal") >= 6 && sum("totalShots") >= 16)
            signal = "YÜKSEK GOL BASKISI";
          else if (sum("shotsOnGoal") >= 3 &&
                   (sum("totalShots") >= 10 || sum("corners") >= 6))
            signal = "ORTA GOL BASKISI";
        }
        return send({ app: "WINN GOAL", signal, statistics });
      }

      if (!["/matches", "/today", "/upcoming"].includes(path))
        return send({ error: "Adres bulunamadı" }, 404);

      const endpoint = path === "/matches"
        ? "fixtures?live=all"
        : "fixtures?date=" + date + "&timezone=Europe%2FIstanbul";

      let matches = (await api(endpoint)).map(map);

      if (path === "/upcoming") {
        matches = matches.filter(m =>
          ["NS", "TBD"].includes(m.status) &&
          new Date(m.kickoff).getTime() >= Date.now()
        );
      }

      return send({
        app: "WINN GOAL",
        updated: new Date().toISOString(),
        count: matches.length,
        matches
      });
    } catch (e) {
      return send({
        error: "Maç verisi alınamadı",
        details: e.message
      }, 502);
    }
  }
};
