import cv2
import numpy as np
image = cv2.imread('capsicum1.jpeg')
    
gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
cv2.imwrite('gray_image.png',gray_image)
cv2.imshow('color_image',image)
cv2.imshow('gray_image',gray_image) 
cv2.waitKey(0)                 # Waits forever for user to press any key
cv2.destroyAllWindows()        # Closes displayed windows
print gray_image.shape

### for morphological operations

kernel = np.ones((5,5),np.uint8)
erosion=cv2.erode(image,kernel,iterations = 1)



