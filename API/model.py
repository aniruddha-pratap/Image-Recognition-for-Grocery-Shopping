# import libraries

import numpy as np
from keras.preprocessing import image
from keras.layers import Conv2D, MaxPooling2D, GlobalAveragePooling2D, AveragePooling2D
from keras.layers import Dropout, Flatten, Dense
from keras.models import Sequential
from keras.callbacks import ModelCheckpoint
from keras.utils import np_utils
from keras import Model

"""
Item categories
save it as a dict since we are not storing the images in the remote server
to pull the categories automatically
"""
obj_names = ['banana',
 'broccoli',
 'cabbage',
 'capsicum',
 'eggplant',
 'grapes',
 'mushroom',
 'onion',
 'orange',
 'peas',
 'potato',
 'tomato']

 # set target image width and heigth
image_width, image_height = 224, 224

# number of items considered
num_obj = len(obj_names)

# number of predictions to be made for the items
top_n = 1

# Define the model using Keras
def define_model():
    model = Sequential()
    # add convolution and pooling layers
    model.add(Conv2D(filters = 8, kernel_size = (3,3), strides = (2,2), padding = 'valid', activation = 'relu',
              input_shape = (image_width, image_height, 3)))
    model.add(MaxPooling2D(pool_size=(3, 3), strides=None, padding='valid'))
    model.add(Conv2D(filters = 16, kernel_size = (3,3), strides = (1,1), padding = 'valid', activation = 'relu'))
    model.add(MaxPooling2D(pool_size=(3, 3), strides=None, padding='valid'))
    # dropout to prevent overfitting
    model.add(Dropout(0.15))
    model.add(Conv2D(filters = 32, kernel_size = (3,3), strides = (1,1), padding = 'valid', activation = 'relu'))
    model.add(AveragePooling2D(pool_size=(3, 3), strides=None, padding='valid'))
    model.add(Flatten())
    # add dense layers
    model.add(Dense(256, activation='relu'))
    model.add(Dropout(0.15))
    model.add(Dense(108, activation='relu'))
    model.add(Dense(num_obj, activation='softmax'))
    return model

# load a pre trained model using the saved checkpoints for the weights and bias
def load_trained_model():
    model = define_model()
    # Compiling the model
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    # Load model weights with best validation loss.
    model.load_weights('./chkpoints/checkpoints_with_best_loss_v3.hdf5')
    return model

# convert the incoming image to tensor
def image_to_tensor_format(input_image):
    img = image.load_img(input_image, target_size=(image_width, image_height))
    # convert image to 3D tensor of form (224, 224, 3)
    image_tensor = image.img_to_array(img)
    # converting 3D tensor to 4D tensor as required by keras as (1, 224, 224, 3) and return
    # no of samples = 1 as for a single image
    return np.expand_dims(image_tensor, axis=0)

# predict the image using the loaded model
def predict_obj(path):
    # load image and convert to 4D tensor
    image_tensor = image_to_tensor_format(path).astype('float32')/255
    # load model and feed the tensor for item prediction
    model = load_trained_model()
    image_prediction = model.predict(image_tensor, batch_size=32, verbose=1)[0]
    obj_predicted = [obj_names[idx] for idx in np.argsort(image_prediction)[::-1][:top_n]]
    #confidence_predicted = np.sort(image_prediction)[::-1][:top_n]
    return obj_predicted

# make function to make predictions for the uploaded image
def make_prediction(path):
    obj  = predict_obj(path)
    return obj
