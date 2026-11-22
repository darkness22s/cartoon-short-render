# cartoon-short-render

Renders the "Hugging Face" short with GitHub Actions. Run the **render-short** workflow from the Actions tab (or `gh workflow run render-short.yml`). The finished MP4 is the **Rens-Login-HF** artifact.

- `web/` three.js scene, story (shots, camera, screens), painter textures
- `render.mjs` headless Chromium frame renderer
- `audio_hf.py` sound effects stem, `mix.py` levels locked to the voice
- `voice.mp3` the voiceover, `script_hf.txt` the script it was timed to
