"""Mix voice + music + SFX to mix_raw.wav, locked to the voice level.
usage: python3 mix.py voice.mp3 music.wav sfx.wav
- Music bed: gated RMS = 50 % of the voice's gated RMS (-6 dB).
- SFX: gated RMS at or below 50 % of the voice's gated RMS, and peaks capped at 0.7 x the voice peak.
- One linear gain on the whole mix, then a simple peak limiter at 0.97. No ducking, no compression.
finish.sh then applies loudness normalisation to mix_raw.wav."""
import sys, subprocess, wave
import numpy as np

SR = 48000

def load_wav(path):
    with wave.open(path, "rb") as w:
        raw = w.readframes(w.getnframes()); ch = w.getnchannels()
    x = np.frombuffer(raw, np.int16).astype(np.float32) / 32767
    return x.reshape(-1, ch).mean(axis=1)

def load_mp3(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).copy()

def gated_rms(x, win=int(0.05 * SR), gate_db=-40):
    n = len(x) // win
    if n == 0: return 0.0
    w = x[: n * win].reshape(n, win)
    wr = np.sqrt((w ** 2).mean(axis=1))
    peak = wr.max()
    if peak <= 0: return 0.0
    keep = wr > peak * 10 ** (gate_db / 20)
    return float(np.sqrt((wr[keep] ** 2).mean())) if keep.any() else 0.0

voice_path, music_path, sfx_path = sys.argv[1:4]
voice = load_mp3(voice_path)
music = load_wav(music_path); sfx = load_wav(sfx_path)
L = max(len(voice), len(music), len(sfx))
pad = lambda a: np.pad(a, (0, L - len(a)))
voice, music, sfx = pad(voice), pad(music), pad(sfx)

v_rms = gated_rms(voice); v_peak = np.abs(voice).max()
m_rms = gated_rms(music); s_rms = gated_rms(sfx); s_peak = np.abs(sfx).max()

g_music = (0.5 * v_rms) / max(m_rms, 1e-9)
g_sfx = min((0.5 * v_rms) / max(s_rms, 1e-9), (0.7 * v_peak) / max(s_peak, 1e-9))

mix = voice + music * g_music + sfx * g_sfx
peak = np.abs(mix).max()
if peak > 0.97: mix *= 0.97 / peak   # single linear gain on the whole mix (limiter)

db = lambda a, b: 20 * np.log10(max(a, 1e-9) / max(b, 1e-9))
print(f"voice gated RMS {20*np.log10(v_rms):.1f} dBFS, peak {20*np.log10(v_peak):.1f} dBFS")
print(f"music vs voice: {db(m_rms * g_music, v_rms):.1f} dB (target -6.0)")
print(f"sfx   vs voice: {db(s_rms * g_sfx, v_rms):.1f} dB (must be <= -6.0)")
print(f"sfx peak vs voice peak: {db(s_peak * g_sfx, v_peak):.1f} dB (must be <= -3.1)")

pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16)
with wave.open("mix_raw.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("wrote mix_raw.wav", round(L / SR, 2), "s")
