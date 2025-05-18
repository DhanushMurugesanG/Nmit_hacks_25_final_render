# import cv2
# import numpy as np

# net = cv2.dnn.readNet("/Users/vishalchinnasamy/Desktop/Hackathons/Rajasthan Police Hackathon/its-safe-tech/backend/yolov3.weights", "/Users/vishalchinnasamy/Desktop/Hackathons/Rajasthan Police Hackathon/its-safe-tech/backend/yolo3.cfg")
# layer_names = net.getUnconnectedOutLayersNames()

# class_labels = ["person", "bicycle", "car", "motorbike", "aeroplane", "bus", "train", "truck", "boat", "traffic light",
#                 "fire hydrant", "stop sign", "parking meter", "bench", "bird", "cat", "dog", "horse", "sheep", "cow",
#                 "elephant", "bear", "zebra", "giraffe", "backpack", "umbrella", "handbag", "tie", "suitcase", "frisbee",
#                 "skis", "snowboard", "sports ball", "kite", "baseball bat", "baseball glove", "skateboard", "surfboard",
#                 "tennis racket", "bottle", "wine glass", "cup", "fork", "knife", "spoon", "bowl", "banana", "apple",
#                 "sandwich", "orange", "broccoli", "carrot", "hot dog", "pizza", "donut", "cake", "chair", "sofa", "pottedplant",
#                 "bed", "diningtable", "toilet", "tvmonitor", "laptop", "mouse", "remote", "keyboard", "cell phone", "microwave",
#                 "oven", "toaster", "sink", "refrigerator", "book", "clock", "vase", "scissors", "teddy bear", "hair drier",
#                 "toothbrush"]

# def detect_objects(frame):
#     height, width, _ = frame.shape

#     blob = cv2.dnn.blobFromImage(frame, 1 / 255.0, (416, 416), swapRB=True, crop=False)
#     net.setInput(blob)
#     detections = net.forward(layer_names)

#     for detection in detections:
#         for obj in detection:
#             scores = obj[5:]
#             class_id = np.argmax(scores)
#             confidence = scores[class_id]

#             if confidence > 0.5:
#                 center_x, center_y, w, h = (obj[0:4] * np.array([width, height, width, height])).astype('int')

#                 if class_labels[class_id] == "knife":
#                     # Print the detected item
#                     print("Detected:", class_labels[class_id])

#                 cv2.rectangle(frame, (center_x - w // 2, center_y - h // 2), (center_x + w // 2, center_y + h // 2), (0, 255, 0), 2)

#     return frame

# def capture_frames():
#     # Use your preferred method to capture video frames
#     cap = cv2.VideoCapture(0)

#     while True:
#         ret, frame = cap.read()

#         frame_with_objects = detect_objects(frame)

#         cv2.imshow('Detected Objects', frame_with_objects)

#         if cv2.waitKey(1) & 0xFF == ord('q'):
#             break

#     cap.release()
#     cv2.destroyAllWindows()

# capture_frames()

from flask import Flask, render_template, Response
import cv2
import numpy as np

app = Flask(__name__)

net = cv2.dnn.readNet("/Users/vishalchinnasamy/Desktop/Hackathons/Rajasthan Police Hackathon/its-safe-tech/backend/yolov3.weights", "/Users/vishalchinnasamy/Desktop/Hackathons/Rajasthan Police Hackathon/its-safe-tech/backend/yolo3.cfg")
layer_names = net.getUnconnectedOutLayersNames()

class_labels = ["person", "bicycle", "car", "motorbike", "aeroplane", "bus", "train", "truck", "boat", "traffic light",
                "fire hydrant", "stop sign", "parking meter", "bench", "bird", "cat", "dog", "horse", "sheep", "cow",
                "elephant", "bear", "zebra", "giraffe", "backpack", "umbrella", "handbag", "tie", "suitcase", "frisbee",
                "skis", "snowboard", "sports ball", "kite", "baseball bat", "baseball glove", "skateboard", "surfboard",
                "tennis racket", "bottle", "wine glass", "cup", "fork", "knife", "spoon", "bowl", "banana", "apple",
                "sandwich", "orange", "broccoli", "carrot", "hot dog", "pizza", "donut", "cake", "chair", "sofa", "pottedplant",
                "bed", "diningtable", "toilet", "tvmonitor", "laptop", "mouse", "remote", "keyboard", "cell phone", "microwave",
                "oven", "toaster", "sink", "refrigerator", "book", "clock", "vase", "scissors", "teddy bear", "hair drier",
                "toothbrush"]

def detect_objects(frame):
    height, width, _ = frame.shape

    blob = cv2.dnn.blobFromImage(frame, 1 / 255.0, (416, 416), swapRB=True, crop=False)
    net.setInput(blob)
    detections = net.forward(layer_names)

    for detection in detections:
        for obj in detection:
            scores = obj[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]

            if confidence > 0.5:
                center_x, center_y, w, h = (obj[0:4] * np.array([width, height, width, height])).astype('int')

                if class_labels[class_id] == "cell phone":
                    # Print the detected item
                    print("Detected:", class_labels[class_id])

                cv2.rectangle(frame, (center_x - w // 2, center_y - h // 2), (center_x + w // 2, center_y + h // 2), (0, 255, 0), 2)

    return frame

def generate_frames():
    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()

        frame_with_objects = detect_objects(frame)

        ret, jpeg = cv2.imencode('.jpg', frame_with_objects)
        frame_bytes = jpeg.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n\r\n')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/weapon_detection')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True, port=5004)
