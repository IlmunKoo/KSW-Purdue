import os
import librosa
import math
import json
import numpy as np
import random

Feature = "MFCC"
DATASET_PATH = "/content/drive/MyDrive/AudioData&Label/Data Combined" # Raw Audio Data Path
JSON_PATH = "/content/drive/MyDrive/Colab Notebooks/DL/Data/FinalData/4class-"+Feature+".json" # Path where you want to save data

SAMPLE_RATE = 22050 # 44100 / 2
DURATION = 10
SAMPLES_PER_TRACK = SAMPLE_RATE*DURATION


# MFCC, Mel, mfcc, Contrast, Tonnetz
def save_mfcc(dataset_path, json_path, num_segments=5): # json_path: json to store
    # n_segments: chop and save different segments
    # dictionary to store data
    data = {
        "mfcc" : [],
        "labels" : []
    }
    labelList = ["noise", "unloaded", "1_payload", "2_payloads"] # class name
    hop_length = 512 # 데이터 손실 막기 위해 window를 겹치는 길이 

    num_samples_per_segment = int(SAMPLES_PER_TRACK / num_segments)
    expected_num_mfcc_vectors_per_segment = math.ceil(num_samples_per_segment / hop_length )# 1.2(float) -> 2(int) 왜 올림?
    
    # loop through all labels
    for i, (dirpath, dirnames, filenames) in enumerate(os.walk(dataset_path)): # recursively go through all 
        if dirpath is not DATASET_PATH:
            dirpath_components = dirpath.split("/") # uav/payload => ["uav","payload"]
            semantic_label = dirpath_components[-1] # class(noise, unloaded, 1_payload, 2_payloads)
            dirpath_part = dirpath.split('/')
            label_idx = 0
            current_label = ""
            for j in labelList:
                if j in dirpath_part:
                    label_idx = labelList.index(j)
                    current_label = j
            print("\nProcessing{}, current_label:{}" .format(semantic_label,current_label))
            print(f'dirpath: {dirpath}, dirnames:{dirnames}, label_idx:{label_idx}, current_label:{current_label}')
                    
                file_path = os.path.join(dirpath, f)
                signal, sr = librosa.load(file_path, sr = SAMPLE_RATE)
                # process segments extracting mfcc and storing data 
                for s in range(num_segments):
                    start_sample = num_samples_per_segment * s # s = 0 -> 0
                    finish_sample = start_sample + num_samples_per_segment # s=0 -> num_samples_per_segment
                    mfcc = librosa.feature.mfcc(signal[start_sample:finish_sample],  # feature extraction
                                                sr= sr,
                                                hop_length = hop_length,
                                                n_mfcc=40
                                                )
                    
                    mfcc = mfcc.T

                    # store mfcc for segment if it has the expected length
                    if len(mfcc) == expected_num_mfcc_vectors_per_segment:
                        data['mfcc'].append(mfcc.tolist()) # numpy array -> list; json저장 위함
                        data['labels'].append(label_idx) # 각 iteration마다 다른 label 나온다. value를 각각 genre에 매핑
                        print("{}, segment:{}, dirnames:{}, label_idx:{}, current_label:{}, data[labels]:{}" .format(file_path, s+1, dirnames, label_idx, current_label, i ))
    # save as json
    with open(json_path, "w") as fp: # file path
        json.dump(data, fp, indent = 4)
        print("===========================================================================")
        print(f"Data successfully saved at {JSON_PATH}")

save_mfcc(DATASET_PATH, JSON_PATH, num_segments=10)
