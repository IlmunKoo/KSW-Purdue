# RNN 
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, classification_report, confusion_matrix, ConfusionMatrixDisplay, confusion_matrix
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from tensorflow import keras
import json


DATASET_PATH = "/content/drive/MyDrive/Colab Notebooks/DL/Data/4class-MFCC.json"


def load_data(dataset_path):
    # open and read json "r"
    with open(dataset_path, "r") as fp:
        data = json.load(fp)
    # convert numpy lists to numpy arrays
    inputs = np.array(data["mfcc"]) # mfcc, mel, contrast, chroma
    targets = np.array(data["labels"])
    print("Data successfully loaded")

    return inputs, targets 

def predict(model, X, y):

    X = X[np.newaxis, ...] # passing the dots 

    # prediction = [[0.1, 0.2, ...]]
    prediction = model.predict(X) # X -> (1, 130, 13, 1) predict는 4차원 행렬 넣어야 함 

    # extract index with max value
    predicted_index = np.argmax(prediction, axis = 1) # [4] we have predicted index
    print("Expected index: {}, Predicted index: {}" .format(y, predicted_index))

def prepare_datasets(test_size, validation_size):
    # load data
    X, y = load_data(DATASET_PATH)

    # create train/test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size)

    # create train/validation split
    X_train, X_validation, y_train, y_validation = train_test_split(X_train, y_train, test_size=validation_size )

    # CNN 쓰기 위해 작성한 코드. 추가적인 dimension이 필요하지 않음. 
    # # add an axis to input sets. 3D array -> (130, 13, 1) (time , MFCC 개수, channel 개수;음성은 1개) CNN은 3D array 넣어줘야 함
    # X_train = X_train[..., np.newaxis] # ...-> give me what i have now // 4D array->(num_samples, 130, 13, 1)
    # X_validation = X_validation[..., np.newaxis] # num_steps we have
    # X_test = X_test[..., np.newaxis]

    return X_train, X_validation, X_test, y_train, y_validation, y_test

def plot_history(history):
    fig, axs = plt.subplots(2)

    # create accuracy subplot
    axs[0].plot(history.history["accuracy"], label ="train accuracy")
    axs[0].plot(history.history["val_accuracy"], label ="test accuracy")
    axs[0].set_ylabel("Accuracy")
    axs[0].legend(loc="lower right")
    axs[0].set_title("Accuracy eval")

    # create error subplot
    axs[1].plot(history.history["loss"], label ="train error")
    axs[1].plot(history.history["val_loss"], label ="test error")
    axs[1].set_ylabel("Error")
    axs[1].set_xlabel("Epoch")
    axs[1].legend(loc="upper right")
    axs[1].set_title("Error eval")

    plt.show()
    
def build_model(input_shape):
    """ Generates RNN-LSTM model 
    
    :param input shape(tuple): Shape of input set
    :return model: RNN-LSTM model 
    
    """
    # build network topology
    model = keras.Sequential() 

    # 2 LSTM layers
    model.add(keras.layers.LSTM(64, input_shape = input_shape, return_sequences=True )) # units, input_shape 
    # return_sequence; 2 타입의 layer가 있다. seq-seq, seq-vector(input 여러개, output으로 prediction 하나만을 받음(예시))
    model.add(keras.layers.LSTM(64))

    # dense layer
    model.add(keras.layers.Dense(64, activation='relu'))
    model.add(keras.layers.Dropout(0.3))

    # output layer 
    model.add(keras.layers.Dense(4, activation='softmax')) # 3개의 뉴런, 3개의 종류
    
    return model 


# get train, validation and test sets  validation: hyperparameter 최적화
X_train, X_validation, X_test, y_train, y_validation, y_test = prepare_datasets(0.25, 0.2) # X:input, y:output

# create network
input_shape = (X_train.shape[1], X_train.shape[2]) # 2개의 dimension만 필요; 130(num_slide;steps), 13(actual coefficients that we extract; MFCC개수)
model = build_model(input_shape)

# compile the network 
optimizer = keras.optimizers.Adam(learning_rate = 0.0001)
model.compile(optimizer=optimizer, 
              loss="sparse_categorical_crossentropy",
              metrics=['accuracy']
              )

model.summary() 


# train the model 
history = model.fit(X_train, y_train, validation_data= (X_validation, y_validation),
          batch_size = 32, # highlevel hyperparameter 
          epochs=200,
					callbacks=[keras.callbacks.EarlyStopping('val_loss', patience=10)
					])

# plot accuracy/error for training and validation 
plot_history(history)

# evaluate the model on the test set
test_error, test_accuracy = model.evaluate(X_test, y_test, verbose=1)
print("Accuracy on test set is : {}" .format(test_accuracy))

# make prediction on a sample 
X = X_test[100]
y = y_test[100]

predict(model, X,y)


# confusion matrix
y_pred = np.argmax(model.predict(X_test), axis=-1)
labels = ["noise", "unloaded", "1_payload", "2_payloads"]
cm = confusion_matrix(y_test, y_pred)
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=labels)
disp.plot(cmap=plt.cm.Blues)
plt.show()


print('f1 score:',f1_score(y_test, y_pred, average="macro"))
print('precision_score:',precision_score(y_test, y_pred, average="macro"))
print('recall_score:',recall_score(y_test, y_pred, average="macro"))
