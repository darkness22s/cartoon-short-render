"""Sound-only stems for 'The Hugging Face Incident' (no music). Writes work/sfx.wav and work/music.wav (silent)."""
import numpy as np, wave
SR = 48000; FRAMES = 2624; DUR = FRAMES / 30; N = int(DUR * SR)
rng = np.random.default_rng(11)
def noise(d): return rng.standard_normal(int(d * SR)).astype(np.float32)
def lp_fast(x, cutoff):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 / (1 + (f / cutoff) ** 4); return np.fft.irfft(X, len(x)).astype(np.float32)
def hp_fast(x, cutoff):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X *= 1 - 1 / (1 + (f / cutoff) ** 4); return np.fft.irfft(X, len(x)).astype(np.float32)
def place(buf, sig, t0, gain=1.0):
    i = int(t0 * SR); j = min(len(buf), i + len(sig))
    if 0 <= i < len(buf) and j > i: buf[i:j] += sig[: j - i] * gain
F = lambda f: f / 30
sfx = np.zeros(N, np.float32)
def click():
    n = int(0.03 * SR); t = np.arange(n) / SR; return (hp_fast(noise(0.03), 2000) * np.exp(-t * 180)).astype(np.float32)
def ping(f0=1320):
    n = int(0.5 * SR); t = np.arange(n) / SR; return (np.sin(2 * np.pi * f0 * t) * np.exp(-t * 10) * 0.4).astype(np.float32)
def thunk(f0=90, d=0.3):
    n = int(d * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f0 * t * (1 + 0.6 * np.exp(-t * 40))) * np.exp(-t * 14) + lp_fast(noise(d), 1200) * np.exp(-t * 30) * 0.5).astype(np.float32)
def buzz(d=0.6):
    n = int(d * SR); t = np.arange(n) / SR; return (np.sign(np.sin(2 * np.pi * 120 * t)) * 0.4 * np.exp(-t * 3)).astype(np.float32)
def whoosh(d=0.5):
    n = int(d * SR); t = np.arange(n) / SR; return (lp_fast(noise(d), 1500) * np.sin(np.pi * t / d) ** 2 * 0.6).astype(np.float32)
def creak(d=0.6, f0=140):
    n = int(d * SR); t = np.arange(n) / SR
    ph = np.cumsum(f0 * (1 + 0.35 * np.sin(2 * np.pi * 1.3 * t / d))) / SR
    s = lp_fast((np.mod(ph, 1) < 0.08).astype(np.float32) * (0.6 + 0.4 * rng.random(n).astype(np.float32)), 2200) * np.sin(np.pi * t / d)
    return hp_fast(s, 200) * 2.5
def sting(d=2.0):
    n = int(d * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 41 * t) * np.exp(-t * 1.5) + lp_fast(noise(d), 900) * np.exp(-t * 6) * 0.7).astype(np.float32)
def hum(d):
    n = int(d * SR); t = np.arange(n) / SR
    return (lp_fast(noise(d), 300) * 0.8 + 0.2 * np.sin(2 * np.pi * 60 * t)).astype(np.float32)
# typing while the lab works through the answers
t = F(1312)
while t < F(1500):
    place(sfx, click(), t, 0.6 * rng.uniform(0.7, 1.0)); t += rng.uniform(0.11, 0.2)
# message pings, one per bubble
for i in range(6): place(sfx, ping(1320 if i % 2 else 1100), F(717 + i * 38), 0.35)
place(sfx, buzz(0.6), F(142), 0.7)                 # the sandbox alarm
place(sfx, creak(0.9, 120), F(947), 0.8); place(sfx, whoosh(0.5), F(1000), 0.45)   # hub door opens
place(sfx, thunk(85, 0.35), F(1152), 0.8)          # credentials recovered
place(sfx, thunk(85, 0.35), F(1241), 0.8)          # code execution
place(sfx, whoosh(0.5), F(1519), 0.4)              # friend walks in
place(sfx, thunk(70, 0.4), F(1750), 0.7)           # JUL 16
place(sfx, thunk(70, 0.4), F(1853), 0.7)           # JUL 21
place(sfx, ping(1500), F(1993), 0.35)              # MAY?
place(sfx, sting(2.0), F(2260), 0.6)               # the open question
place(sfx, hum(DUR), 0, 0.25)                      # room tone under everything
def write(path, x):
    pcm = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    with wave.open(path, "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
write("work/sfx.wav", sfx / max(1e-6, np.abs(sfx).max()) * 0.5)
write("work/music.wav", np.zeros(N, np.float32))
print("stems ok", round(DUR, 2))
