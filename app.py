import os
from flask import Flask, request, render_template, jsonify
import numpy as np
import tensorflow as tf
import cv2
import base64
from io import BytesIO
from PIL import Image

app = Flask(__name__)


MODEL_PATH = 'anti_spoofing_model.h5'
model = tf.keras.models.load_model(MODEL_PATH)

def preprocess_image(img):
    img_resized = cv2.resize(img, (64, 64)) 
    img_array = img_resized.astype('float32') / 255.0  
    img_array = np.expand_dims(img_array, axis=0)  
    return img_array

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    img_array = None
    if 'file' in request.files:
        file = request.files['file']
        img_bytes = file.read()
        img_array = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)
    elif 'image' in request.form:
        try:
            img_data = request.form['image'].split(',')[1]
            img_bytes = base64.b64decode(img_data)

            
            img = Image.open(BytesIO(img_bytes))
            img = img.convert('RGB')  
            img_array = np.array(img)
        except Exception as e:
            return jsonify({'error': 'Invalid image data', 'details': str(e)}), 400
    else:
        return jsonify({'error': 'No image found'}), 400

    try:
        processed_img = preprocess_image(img_array)
        prediction = model.predict(processed_img)
        is_real = prediction[0][0] > 0.5
        confidence = float(prediction[0][0]) if is_real else float(1 - prediction[0][0])

        return jsonify({
            'is_real': bool(is_real),
            'confidence': confidence
        })
    except Exception as e:
        return jsonify({'error': 'Prediction failed', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

