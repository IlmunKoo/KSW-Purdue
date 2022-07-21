
def freq_augment(spec: np.ndarray, num_mask=2, 
                 freq_masking_max_percentage=0.15, time_masking_max_percentage=0.3):

    spec = spec.copy()
    for i in range(num_mask): # Spectrogram에 masking할 개수만큼 
        all_frames_num, all_freqs_num = spec.shape
        freq_percentage = random.uniform(0.0, freq_masking_max_percentage)
        
        num_freqs_to_mask = int(freq_percentage * all_freqs_num)
        f0 = np.random.uniform(low=0.0, high=all_freqs_num - num_freqs_to_mask)
        f0 = int(f0)
        spec[:, f0:f0 + num_freqs_to_mask] = 0 # mask의 크기만큼 0으로 채워 줍니다.
    
    return spec

def time_augment(spec: np.ndarray, num_mask=2, 
                 freq_masking_max_percentage=0.15, time_masking_max_percentage=0.3):

    spec = spec.copy()
    for i in range(num_mask):
        all_frames_num, all_freqs_num = spec.shape
        time_percentage = random.uniform(0.0, time_masking_max_percentage)
        
        num_frames_to_mask = int(time_percentage * all_frames_num)
        t0 = np.random.uniform(low=0.0, high=all_frames_num - num_frames_to_mask)
        t0 = int(t0)
        spec[t0:t0 + num_frames_to_mask, :] = 0 # mask의 크기만큼 0으로 채워 줍니다. 
    
    return spec

freq_spec = []
time_spec = []

# Iterate through each sound file
for index, row in mfcc_features.iterrows():
    class_label = row["class_label"]
    freq_aug = freq_augment(mfcc_features.feature[index])
    time_aug = time_augment(mfcc_features.feature[index])
    freq_spec.append([freq_aug, class_label])
    time_spec.append([time_aug, class_label])

# Convert into a Panda dataframe 
freq_augment = pd.DataFrame(freq_spec, columns=['feature','class_label'])
time_augment = pd.DataFrame(time_spec, columns=['feature', 'class_label'])
