import sys
sys.path.append('/libsvm-3.22/python') #Path to libsvm directory
sys.path.append('/***/***/anaconda/lib/python2.7/site-packages') # Path to diretory
sys.path.append('/***/***/anaconda/lib/site-python')#path to directory
from PIL import Image
from sklearn import svm
import numpy as np
import pandas as pd
import os
import time
from sklearn.model_selection import train_test_split
from sklearn.svm import LinearSVC, SVC
from sklearn.neighbors import KNeighborsClassifier
import multiprocessing
from sklearn.decomposition import PCA
from sklearn.decomposition import TruncatedSVD
from sklearn.ensemble import BaggingClassifier, RandomForestClassifier
from sklearn.preprocessing import normalize
from sklearn.model_selection import GridSearchCV
from sklearn.multiclass import OneVsRestClassifier
from skimage import io, color, img_as_ubyte
from skimage.feature import greycomatrix, greycoprops
from sklearn import preprocessing
from sklearn.metrics.cluster import entropy
import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)


start_time = time.time()

if multiprocessing.cpu_count() > 2:
    cores = multiprocessing.cpu_count()-2
else:
    cores = 1

ROOT_DIR_OLD = '/Images/' #Path to the Images directory
ROOT_DIR = '/****/***/Desktop/Test/Images/apple/' #path to the apple category directory for initial trial
#Store data and labels
ALL_TRAIN_IMAGES = []
ALL_TRAIN_LABELS = []

class_to_number_convert={'good':1,'bad':0}
number_to_class_convert={1:'good',0:'bad'}

class_list = ['good','bad']

distances = [1, 2, 3]
angles = [0, np.pi/4, np.pi/2, 3*np.pi/4]
properties = ['energy', 'homogeneity','contrast']


time_to_start_image_convert = time.time()
# Test for any image files that may not be in the expected format. Ignore any such file.
incorrect_file = []
for c in class_list:
    print 'Going to start converting the class - '+c
    list_of_images = os.listdir(ROOT_DIR+c)
    for image in list_of_images:

        #print 'converting the file - '+ROOT_DIR+c+'/'+image+'\n'
        rgbImg = io.imread(ROOT_DIR+c+'/'+image)
        grayImg = img_as_ubyte(color.rgb2gray(rgbImg))
        glcm = greycomatrix(grayImg,
                            distances=distances,
                            angles=angles,
                            symmetric=True,
                            normed=True)
        cont = greycoprops(glcm, 'contrast')
        diss = greycoprops(glcm, 'dissimilarity')
        homo = greycoprops(glcm, 'homogeneity')
        eng = greycoprops(glcm, 'energy')
        corr = greycoprops(glcm, 'correlation')
        ASM = greycoprops(glcm, 'ASM')

        stats = np.concatenate((cont,diss,homo,eng,corr,ASM))
        # stats is an ndarray with shape (3,4). Converting it to (1,12)
        ALL_TRAIN_IMAGES.append(stats)
        ALL_TRAIN_LABELS.append(class_to_number_convert[c])
        # Converting each image to numpy array using ANTIALIAS filter for good quality. Resizing the pixels.
        #image_object = Image.open(ROOT_DIR+c+'/'+image).resize((50,50),Image.ANTIALIAS)
        #a = np.array(image_object)

        #if a.shape == (50,50, 3):
        #    ALL_TRAIN_IMAGES.append(a)
        #    ALL_TRAIN_LABELS.append(class_to_number_convert[c])
        #else:
        #print 'INCORRECT FILE FOUND! - '+c+'/'+image
        #    incorrect_file.append(c+'/'+image)
print 'TOTAL TIME TO CONVERT ALL IMAGES AND LABELS = %s SECONDS' %(time.time() - time_to_start_image_convert)


# Convert the lists to numpy arrays and reshape
ALL_TRAIN_LABELS_NP = np.asarray(ALL_TRAIN_LABELS)
ALL_TRAIN_IMAGES_NP = np.asarray(ALL_TRAIN_IMAGES)

n_samples = len(ALL_TRAIN_IMAGES_NP)
data = ALL_TRAIN_IMAGES_NP.reshape((n_samples, -1))
labels = ALL_TRAIN_LABELS_NP





print '\n Calculating the randomly generated training and testing data and labels set \n'
data_train, data_test, labels_train, labels_test = train_test_split(data, labels, train_size=0.80, random_state=42)
#data_train, data_test, labels_train, labels_test = train_test_split(normalized_data, labels, train_size=0.95, random_state=42)
#pca_data_train, pca_data_test, pca_labels_train, pca_labels_test = train_test_split(data_pca_transformed, labels, train_size=0.80, random_state=42)
#svd_data_train, svd_data_test, svd_labels_train, svd_labels_test = train_test_split(data_svd_transformed, labels, train_size=0.80, random_state=42)
print 'Datasets generated'


# Try different Models and calculate results.

# 1. Linear SVC
test_rgb_image = io.imread('/****/***/Desktop/fresh-apple.jpg') # path to the input image 
test_grayImg = img_as_ubyte(color.rgb2gray(test_rgb_image))
test_image_glcm = greycomatrix(test_grayImg,
                    distances=distances,
                    angles=angles,
                    symmetric=True,
                    normed=True)
test_cont = greycoprops(test_image_glcm, 'contrast')
test_diss = greycoprops(test_image_glcm, 'dissimilarity')
test_homo = greycoprops(test_image_glcm, 'homogeneity')
test_eng = greycoprops(test_image_glcm, 'energy')
test_corr = greycoprops(test_image_glcm, 'correlation')
test_ASM = greycoprops(test_image_glcm, 'ASM')

test_stats = np.concatenate((test_cont, test_diss, test_homo, test_eng, test_corr, test_ASM))
#test_image_stats = greycoprops(test_image_glcm)
test_array = np.asarray(test_stats)
test_length = len(test_array)
test_array_reshaped = test_array.reshape(1,-1)

print '\nTrying to fit Linear SVC classifier'
lin_clf = LinearSVC()
lin_clf.fit(data_train, labels_train)
print 'Score:'
print lin_clf.score(data_test, labels_test)

print 'Now trying to guess the label for test image'
predicted_label_linear_svc = lin_clf.predict(test_array_reshaped)
print predicted_label_linear_svc


# 3. Random Forests
print '\nTrying to fit Random Forsest classifier'
rf_clf = RandomForestClassifier(min_samples_leaf=20, n_jobs=cores)
rf_clf.fit(data_train, labels_train)
print 'Score:'
print rf_clf.score(data_test, labels_test)
print "Now trying to guess the label for test image"
predicted_label_rf= rf_clf.predict(test_array_reshaped)
print predicted_label_rf
