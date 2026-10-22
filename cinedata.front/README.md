# cinedata.front

Angular 22 (standalone, signals, `httpResource`, sem zone.js).

```bash
npm install
npx ng serve --port 4300   # proxy de /api para http://localhost:5232 (proxy.conf.json)
npx ng test --watch=false
npx ng build
```

| Rota | Página |
| --- | --- |
| `/` | Painel da semana: KPIs, top 10, nacional × estrangeiro, dublado × legendado, mapa por UF |
| `/obras/:codigo` | Obra: lançamento, renda, curva de público diário |
| `/marca` | Identidade visual e prévia de post |

Gráficos ficam em `src/app/shared/charts` (SVG/CSS próprios); tokens de cor e tipografia em `src/styles.scss`.
