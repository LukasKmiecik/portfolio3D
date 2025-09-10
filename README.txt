# Portfolio 3D – statyczna wersja
Gotowy mini‑szablon: interaktywne modele (GLB/GLTF), filtry kategorii, wyszukiwarka i proste statystyki.

## Jak używać
1. Otwórz `index.html` lokalnie (podwójne kliknięcie) – do testów wystarczy.
2. Hostowanie: wrzuć cały folder na Vercel/Netlify/GitHub Pages lub dowolny hosting statyczny.
3. Podmień dane w `projects.json`:
   - `model`: link do pliku `.glb/.gltf` (najlepiej `.glb` z kompresją Draco i KTX2).
   - `poster`: miniatura (webp/png).
   - `category`: `mechaniczne` | `instalacje` | `produkt` | `inne`. Dodaj własne jeśli chcesz – uzupełnij wtedy przyciski w HTML.
   - `page`: link do strony projektu lub repozytorium.
4. (Opcjonalnie) Skonfiguruj Plausible Analytics:
   - Zmień `data-domain="example.com"` w `<script>` na swoją domenę.
   - W panelu Plausible dodaj własne zdarzenia: `Site Visit`, `Model Viewed` (już wysyłane).

## Formaty 3D
- GLB/GLTF: preferowane (jeden plik, szybkie ładowanie).
- Użyj **Draco** i **KTX2** dla mniejszych plików (ekspory w Blender/Rhino/SolidWorks→Blender).
- Dla iOS Quick Look możesz dodać eksport USDZ i pole `ios-src` w `<model-viewer>`.

## SEO i wydajność
- Dodaj unikalne tytuły i opisy do `projects.json`.
- Wygeneruj miniatury (poster) 1280×720 WebP.
- Trzymaj modele ≤10–20 MB; duże sceny podziel lub użyj instancji.

## Prywatność (GDPR)
- Plausible jest bezciasteczkowe (łatwiej z RODO). Alternatywy: Umami (self‑host), Matomo (self‑host), GA4.
- Jeżeli używasz cookies/GA4 – dodaj baner zgody.

Powodzenia!
