# MFCCs


import json
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix
from tensorflow import keras
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, classification_report, confusion_matrix, ConfusionMatrixDisplay, confusion_matrix


DATASET_PATH = "/content/drive/MyDrive/Colab Notebooks/DL/Data/FinalData/4class-MFCC.json"

def load_data(dataset_path):
    # open and read json "r"
    with open(dataset_path, "r") as fp:
        data = json.load(fp)

    # convert numpy lists to numpy arrays
    inputs = np.array(data["mfcc"])
    print(len(inputs))
    targets = np.array(data["labels"])
    
    print("Data successfully loaded")

    return inputs, targets 

def prepare_datasets(test_size, validation_size):
    # load data
    X, y = load_data(DATASET_PATH)

    # create train/test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size)

    # create train/validation split
    X_train, X_validation, y_train, y_validation = train_test_split(X_train, y_train, test_size=validation_size )

    # 3D array -> (130, 13, 1) (time , MFCC 개수, channel 개수;음성은 1개) CNN은 3D array 넣어줘야 함
    X_train = X_train[..., np.newaxis] # ...-> give me what i have now // 4D array->(num_samples, 130, 13, 1)
    X_validation = X_validation[..., np.newaxis]
    X_test = X_test[..., np.newaxis]

    return X_train, X_validation, X_test, y_train, y_validation, y_test 

def plot_history(history):
    fig, axs = plt.subplots(2)
    
    # create accuracy subplot
    axs[0].plot(history.history["accuracy"], label ="train accuracy")
    axs[0].plot(history.history["val_accuracy"], label ="test accuracy")
    axs[0].set_ylabel("Accuracy")
    axs[0].legend(loc="lower right")
    axs[0].set_title("Accuracy eval-CRNN-mfcc")

    # create error subplot
    axs[1].plot(history.history["loss"], label ="train error")
    axs[1].plot(history.history["val_loss"], label ="test error")
    axs[1].set_ylabel("Error")
    axs[1].set_xlabel("Epoch")
    axs[1].legend(loc="upper right")
    axs[1].set_title("Error eval")

    plt.show()

def plot_confusionMatrix(y_true, y_pred):
    # Generate the confusion matrix
    cf_matrix = confusion_matrix(y_true, y_pred)

    ax = sns.heatmap(cf_matrix, annot=True, cmap='Blues', fmt="d")

    ax.set_title('payload detection Confusion Matrix with MFCCs\n\n');
    ax.set_xlabel('\nPredicted Values')
    ax.set_ylabel('Actual Values ');

    ## Ticket labels - List must be in alphabetical order

    ax.xaxis.set_ticklabels(["noise", "unloaded", "1_payload", "2_payloads"])
    ax.yaxis.set_ticklabels(["noise", "unloaded", "1_payload", "2_payloads"])

    ## Display the visualization of the Confusion Matrix.
    plt.show()

def build_model(input_shape):
    initializer = keras.initializers.HeNormal()
    # Create model.
    model = keras.Sequential()

    # 1st convolutional layer.
    model.add(keras.layers.Conv2D(16, (3, 3), activation='relu', input_shape=input_shape, kernel_initializer=initializer))
        # 16 kernels, and 5x5 grid size of kernel.
    # model.add(keras.layers.MaxPool2D((5, 5), strides=(2, 2), padding='same'))
    model.add(keras.layers.AveragePooling2D(padding="same"))
        # Pooling size 5x5.
    model.add(keras.layers.BatchNormalization())
        # Batch Normalization allows model to be more accurate and computations are faster.

    # Resize for RNN part.
    resize_shape = model.output_shape[2] * model.output_shape[3]
    model.add(keras.layers.Reshape((model.output_shape[1], resize_shape)))

    # RNN layer.
    model.add(keras.layers.LSTM(32, input_shape=input_shape, return_sequences=True))

    # Flatten the output and feed into dense layer.
    model.add(keras.layers.Flatten())
    model.add(keras.layers.Dense(32, activation='relu'))
        # 32 neurons.
    model.add(keras.layers.Dropout(0.3))
        # Reduces chances of over fitting.

    # Output layer that uses softmax activation.
    model.add(keras.layers.Dense(4, activation='softmax'))
        # 2 neurons --> depends on how many categories we want to predict.

    return model

def predict(model, X, y):

    X = X[np.newaxis, ...] # passing the dots 

    # prediction = [[0.1, 0.2, ...]]
    prediction = model.predict(X) # X -> (1, 130, 13, 1) predict는 4차원 행렬 넣어야 함 

    # extract index with max value
    predicted_index = np.argmax(prediction, axis = 1) # [4] we have predicted index
    print("Expected index: {}, Predicted index: {}" .format(y, predicted_index))


# create train, validation and test sets  validation: hyperparameter 최적화
X_train, X_validation, X_test, y_train, y_validation, y_test = prepare_datasets(0.2, 0.25) # X:input, y:output

# build the CNN net
input_shape = (X_train.shape[1], X_train.shape[2], X_train.shape[3]) # X_train: (num_samples, 130 time bins, 13 MFCC, 1 channel) # 원래 X_train.shape[3]
print(f"input_shape:{input_shape}")
model = build_model(input_shape)

# compile the network 
optimizer = keras.optimizers.Adam(learning_rate = 0.0001)
model.compile(optimizer=optimizer, 
              loss="sparse_categorical_crossentropy",
              metrics=['accuracy']
              )

model.summary()

# train the CNN 
history = model.fit(X_train, y_train, validation_data= (X_validation, y_validation),
          batch_size = 32, # highlevel hyperparameter 
          epochs=200,
          callbacks=[keras.callbacks.EarlyStopping('val_loss', patience=10)]
          )


# plot accuracy/error for training and validation 
plot_history(history)


# evaluate the CNN on the test set
test_error, test_accuracy = model.evaluate(X_test, y_test, verbose=2)
print(f"Accuracy on test set is : {test_accuracy:.4f}")
print()

outputs = model.predict(X_test)
prediction = np.argmax(outputs,1)
y_pred = prediction
plot_confusionMatrix(y_test, y_pred)

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
