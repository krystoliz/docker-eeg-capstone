import numpy as np
import pandas as pd
from numpy import trapezoid
from scipy.fft import rfft, rfftfreq
from numpy.linalg import eigvals

np.random.seed(42)

# --- 1. SIMULATION ---

def simulate_eeg_pair(sr=256, duration=6.0, bands=None):
    """Simulate two EEG-like channels by summing random sinusoids."""
    if bands is None:
        bands = {'delta':(0.5,4),'theta':(4,8),'alpha':(8,13),'beta':(13,30),'gamma':(30,45)}
    
    t = np.arange(0, duration, 1/sr)
    
    def make_channel():
        x = np.zeros_like(t)
        # sum few sinusoids per band
        for name,(fmin,fmax) in bands.items():
            n_sines = np.random.randint(3,6)
            freqs = np.random.uniform(fmin, fmax, size=n_sines)
            amps = np.random.uniform(0.6, 1.8, size=n_sines) * (1.0 if name!='gamma' else 0.6)
            phases = np.random.uniform(0, 2*np.pi, size=n_sines)
            for f,a,p in zip(freqs,amps,phases):
                x += a * np.sin(2*np.pi*f*t + p)
        # add low-frequency baseline + broadband gaussian noise
        x += 0.25*np.sin(2*np.pi*0.3*t + np.random.rand()*2*np.pi)  # slow drift
        x += np.random.normal(0, 0.7, size=len(t))  # broadband noise
        return x
    
    ch1 = make_channel()
    ch2 = 0.65*ch1 + 0.35*make_channel() # make ch2 correlated
    
    # Return serializable lists
    return t.tolist(), ch1.tolist(), ch2.tolist()

# --- 2. FEATURE EXTRACTION ---

def compute_psd(x, sr):
    n = len(x)
    xf = rfft(x * np.hanning(n))
    psd = (np.abs(xf)**2) / (sr * n)
    freqs = rfftfreq(n, 1/sr)
    return freqs, psd

def band_power(freqs, psd, f_low, f_high):
    mask = (freqs >= f_low) & (freqs < f_high)
    if not np.any(mask):
        return 0.0
    return trapezoid(psd[mask], freqs[mask])

def extract_features(ch1, ch2, sr=256):
    # Convert lists back to numpy arrays
    ch1 = np.array(ch1)
    ch2 = np.array(ch2)
    
    eps = 1e-12
    freqs1, psd1 = compute_psd(ch1, sr)
    freqs2, psd2 = compute_psd(ch2, sr)
    bands = {'delta':(0.5,4),'theta':(4,8),'alpha':(8,13),'beta':(13,30),'gamma':(30,45)}
    feats = {}
    
    for i,ch,label in [(1,ch1,'CH1'),(2,ch2,'CH2')]:
        feats[f'{label}_mean'] = float(np.mean(ch))
        feats[f'{label}_std'] = float(np.std(ch, ddof=0))
        feats[f'{label}_min'] = float(np.min(ch))
        feats[f'{label}_max'] = float(np.max(ch))
        feats[f'{label}_rms'] = float(np.sqrt(np.mean(ch**2)))
        for band,(fmin,fmax) in bands.items():
            p = band_power(freqs1 if i==1 else freqs2, psd1 if i==1 else psd2, fmin, fmax)
            feats[f'{label}_P_{band}'] = float(p)
        psd = psd1 if i==1 else psd2
        freqs = freqs1 if i==1 else freqs2
        dom_idx = np.argmax(psd)
        feats[f'{label}_dominant_freq'] = float(freqs[dom_idx])
    
    for band in ['delta','theta','alpha','beta','gamma']:
        p1 = feats[f'CH1_P_{band}']
        p2 = feats[f'CH2_P_{band}']
        feats[f'{band}_asymmetry'] = float(np.log((p1+eps)/(p2+eps)))
    
    cov = np.cov(ch1, ch2)
    feats['cov_12'] = float(cov[0,1])
    eigs = eigvals(cov)
    eigs_sorted = np.sort(eigs)[::-1]
    feats['eig_cov1'] = float(eigs_sorted[0])
    feats['eig_cov2'] = float(eigs_sorted[1])
    return feats

# --- 3. FEATURE ORDER ---
# This is crucial for the ML model
feature_order = [
    "CH1_mean", "CH1_std", "CH1_min", "CH1_max", "CH1_rms",
    "CH1_P_delta", "CH1_P_theta", "CH1_P_alpha", "CH1_P_beta", "CH1_P_gamma",
    "CH1_dominant_freq",
    "CH2_mean", "CH2_std", "CH2_min", "CH2_max", "CH2_rms",
    "CH2_P_delta", "CH2_P_theta", "CH2_P_alpha", "CH2_P_beta", "CH2_P_gamma",
    "CH2_dominant_freq",
    "delta_asymmetry", "theta_asymmetry", "alpha_asymmetry", "beta_asymmetry", "gamma_asymmetry",
    "cov_12", "eig_cov1", "eig_cov2"
]


# --- 4. FEATURE-SPACE GENERATOR ---

def load_feature_stats(path='dataset_adapted.csv'):
    """Load per-label means and stds from a real dataset."""
    df = pd.read_csv(path)
    df = df.drop(columns=['label', 'ch_corr_mean'], errors='ignore')
    labels = pd.read_csv(path)['label']
    means = df.copy()
    means['label'] = labels
    stds = means.groupby('label').std()
    means = means.groupby('label').mean()
    return means, stds

def generate_synthetic_features(label, means, stds):
    """Generate one synthetic feature vector conditioned on a target label."""
    row = np.random.normal(loc=means.loc[label], scale=stds.loc[label])
    return dict(zip(row.index, row.values))
