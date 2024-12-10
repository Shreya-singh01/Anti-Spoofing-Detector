// document.addEventListener('DOMContentLoaded', () => {
//     const imageUpload = document.getElementById('imageUpload');
//     const captureButton = document.getElementById('captureButton');
//     const predictButton = document.getElementById('predictButton');
//     const clearButton = document.getElementById('clearButton'); 
//     const imagePreview = document.getElementById('imagePreview');
//     const resultText = document.getElementById('resultText');
//     const confidenceText = document.getElementById('confidenceText');
//     let capturedImageData = null;

//     imageUpload.addEventListener('change', function (e) {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = function (event) {
//                 imagePreview.src = event.target.result;
//                 imagePreview.style.display = 'block';
//                 capturedImageData = event.target.result;
//             };
//             reader.readAsDataURL(file);
//         }
//     });

//     captureButton.addEventListener('click', () => {
//         const video = document.createElement('video');
//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');

//         canvas.style.display = 'none';
//         document.body.appendChild(video);
//         document.body.appendChild(canvas);

//         navigator.mediaDevices.getUserMedia({ video: true })
//             .then((stream) => {
//                 video.srcObject = stream;
//                 video.play();

//                 video.addEventListener('loadedmetadata', () => {
//                     canvas.width = video.videoWidth;
//                     canvas.height = video.videoHeight;

//                     setTimeout(() => {
//                         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//                         capturedImageData = canvas.toDataURL('image/jpeg');

//                         imagePreview.src = capturedImageData;
//                         imagePreview.style.display = 'block';

//                         stream.getTracks().forEach((track) => track.stop());
//                         video.remove();
//                         canvas.remove();
//                     }, 100);
//                 });
//             })
//             .catch((error) => {
//                 console.error('Error accessing webcam:', error);
//                 resultText.textContent = 'Error accessing webcam';
//                 resultText.style.color = 'red';
//             });
//     });



//  predictButton.addEventListener('click', () => {
//     if (!capturedImageData) {
//         resultText.textContent = 'No image selected or captured!';
//         resultText.style.color = 'red';
//         return;
//     }

//     const formData = new FormData();
//     formData.append('image', capturedImageData); 

//     fetch('/predict', {
//         method: 'POST',
//         body: formData,
//     })
//         .then((response) => response.json())
//         .then((data) => {
//             if (data.is_real) {
//                 resultText.textContent = 'Prediction: Real Image';
//                 resultText.style.color = 'green';
//             } else {
//                 resultText.textContent = 'Prediction: Fake Image';
//                 resultText.style.color = 'red';
//             }
//             confidenceText.textContent = `Confidence: ${(data.confidence * 100).toFixed(2)}%`;
//         })
//         .catch((error) => {
//             console.error('Error:', error);
//             resultText.textContent = 'Error processing image';
//             resultText.style.color = 'red';
//         });
//     });

//     clearButton.addEventListener('click', () => {
//         imagePreview.src = '';
//         imagePreview.style.display = 'none';
//         imageUpload.value = ''; 
//         capturedImageData = null;

//         resultText.textContent = '';
//         confidenceText.textContent = '';
//     });
// });
document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const captureButton = document.getElementById('captureButton');
    const predictButton = document.getElementById('predictButton');
    const clearButton = document.getElementById('clearButton'); 
    const imagePreview = document.getElementById('imagePreview');
    const resultText = document.getElementById('resultText');
    const confidenceText = document.getElementById('confidenceText');
    let capturedImageData = null;

    imageUpload.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                imagePreview.src = event.target.result;
                imagePreview.style.display = 'block';
                capturedImageData = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    captureButton.addEventListener('click', () => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
    
        // Apply CSS to hide video and canvas completely without affecting the layout
        video.style.position = 'fixed';
        video.style.top = '-9999px';
        canvas.style.position = 'fixed';
        canvas.style.top = '-9999px';
    
        document.body.appendChild(video);
        document.body.appendChild(canvas);
    
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                video.srcObject = stream;
                video.play();
    
                video.addEventListener('loadedmetadata', () => {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
    
                    setTimeout(() => {
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
                        capturedImageData = canvas.toDataURL('image/jpeg');
    
                        imagePreview.src = capturedImageData;
                        imagePreview.style.display = 'block';
    
                        // Stop the stream and remove hidden elements
                        stream.getTracks().forEach((track) => track.stop());
                        video.remove();
                        canvas.remove();
                    }, 100);
                });
            })
            .catch((error) => {
                console.error('Error accessing webcam:', error);
                resultText.textContent = 'Error accessing webcam';
                resultText.style.color = 'red';
            });
    });
    



 predictButton.addEventListener('click', () => {
    if (!capturedImageData) {
        resultText.textContent = 'No image selected or captured!';
        resultText.style.color = 'red';
        return;
    }

    const formData = new FormData();
    formData.append('image', capturedImageData); 

    fetch('/predict', {
        method: 'POST',
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.is_real) {
                resultText.textContent = 'Prediction: Real Image';
                resultText.style.color = 'green';
            } else {
                resultText.textContent = 'Prediction: Fake Image';
                resultText.style.color = 'red';
            }
            confidenceText.textContent = `Confidence: ${(data.confidence * 100).toFixed(2)}%`;

        })
        .catch((error) => {
            console.error('Error:', error);
            resultText.textContent = 'Error processing image';
            resultText.style.color = 'red';
        });
    });

    clearButton.addEventListener('click', () => {
        imagePreview.src = '';
        imagePreview.style.display = 'none';
        imageUpload.value = ''; 
        capturedImageData = null;

        resultText.textContent = '';
        confidenceText.textContent = '';
    });
});