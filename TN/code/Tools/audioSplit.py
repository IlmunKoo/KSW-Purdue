import os
import librosa
import soundfile as sf

def trim_audio_data(audio_file, save_file, start_sec=0, end_sec=10):
    y, sr = librosa.load(audio_file)

    ny = y[start_sec*sr:end_sec*sr]

    sf.write(save_file + '.wav', ny, sr)


# set dataset path
base_path = './dataset'
audio_path = base_path + '/big_slow_10'
save_path = base_path + '/big_slow_0719'

audio_list = os.listdir(audio_path)

for audio_name in audio_list:
    if audio_name.find('wav') is not -1:
        audio_file = audio_path + '/' + audio_name
        save_file = save_path + '/' + audio_name[:-4]   # -4 delete ".wav"

        # Using slid window augmentation
        for i in range(0, 8):
            trim_audio_data(audio_file, save_file+f"-{i}", i, i+3)

