import sys
sys.path.append('/libsvm-3.22/python') #Path to libsvm directory
sys.path.append('/Users/aditi/anaconda/lib/python2.7/site-packages') # Path to diretory
sys.path.append('/Users/aditi/anaconda/lib/site-python')#path to directory
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


if multiprocessing.cpu_count() > 2:
    cores = multiprocessing.cpu_count()-2
else:
    cores = 1

def find_texture(predicted_item, input_image_path):
    ROOT_DIR = './TextureImages/'+predicted_item[0]+'/'  # path to the apple category directory for initial trial
    print 'root directory in texture detection is : ',ROOT_DIR
    ALL_TRAIN_IMAGES = []
    ALL_TRAIN_LABELS = []
    class_to_number_convert = {'good': 1, 'bad': 0}
    number_to_class_convert = {1: 'good', 0: 'bad'}
    class_list = ['good', 'bad']
    distances = [1, 2, 3]
    angles = [0, np.pi / 4, np.pi / 2, 3 * np.pi / 4]
    for c in class_list:
        list_of_images = os.listdir(ROOT_DIR + c)
        for image in list_of_images:
            rgbImg = io.imread(ROOT_DIR + c + '/' + image)
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

            stats = np.concatenate((cont, diss, homo, eng, corr, ASM))
            ALL_TRAIN_IMAGES.append(stats)
            ALL_TRAIN_LABELS.append(class_to_number_convert[c])

    ALL_TRAIN_LABELS_NP = np.asarray(ALL_TRAIN_LABELS)
    ALL_TRAIN_IMAGES_NP = np.asarray(ALL_TRAIN_IMAGES)
    n_samples = len(ALL_TRAIN_IMAGES_NP)
    data = ALL_TRAIN_IMAGES_NP.reshape((n_samples, -1))
    labels = ALL_TRAIN_LABELS_NP
    data_train, data_test, labels_train, labels_test = train_test_split(data, labels, train_size=0.80, random_state=42)


    test_rgb_image = io.imread(input_image_path)  # path to the input image
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
    test_array = np.asarray(test_stats)
    test_array_reshaped = test_array.reshape(1, -1)

    lin_clf = LinearSVC()
    lin_clf.fit(data_train, labels_train)
    predicted_label_linear_svc = lin_clf.predict(test_array_reshaped)
    predicted_quality_linear_svc = number_to_class_convert[predicted_label_linear_svc[0]]


    rf_clf = RandomForestClassifier(min_samples_leaf=20, n_jobs=cores)
    rf_clf.fit(data_train, labels_train)
    predicted_label_rf = rf_clf.predict(test_array_reshaped)
    predicted_quality_rf = number_to_class_convert[predicted_label_rf[0]]

    return (predicted_quality_linear_svc , predicted_quality_rf)



