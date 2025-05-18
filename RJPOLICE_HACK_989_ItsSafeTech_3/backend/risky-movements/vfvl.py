# import cv2
# import numpy as np

# net = cv2.dnn.readNet("/Users/vishalchinnasamy/Desktop/Hackathons/Rajasthan Police Hackathon/its-safe-tech/backend/yolov3.weights", "/Users/vishalchinnasamy/Desktop/Hackathons/Rajasthan Police Hackathon/its-safe-tech/backend/yolo3.cfg")
# layer_names = net.getUnconnectedOutLayersNames()


# line_coordinates = [(100, 300), (600, 300)]


# def is_above_line(point):
#     x, y = point
#     x1, y1 = line_coordinates[0]
#     x2, y2 = line_coordinates[1]
#     return (y - y1) * (x2 - x1) > (x - x1) * (y2 - y1)

# cap = cv2.VideoCapture(0)

# while True:
#     ret, frame = cap.read()
#     if not ret:
#         break

#     height, width, _ = frame.shape

#     blob = cv2.dnn.blobFromImage(frame, 1 / 255.0, (416, 416), swapRB=True, crop=False)
#     net.setInput(blob)
#     detections = net.forward(layer_names)


#     for detection in detections:
#         for obj in detection:
#             scores = obj[5:]
#             class_id = np.argmax(scores)
#             confidence = scores[class_id]


#             if confidence > 0.5 and class_id == 0:
    
#                 center_x, center_y, w, h = (obj[0:4] * np.array([width, height, width, height])).astype('int')

                
#                 cv2.rectangle(frame, (center_x - w // 2, center_y - h // 2), (center_x + w // 2, center_y + h // 2), (0, 255, 0), 2)

        
#                 if is_above_line((center_x, center_y)):
#                     print("Person fully crossed or climbed above the virtual line!")

#     cv2.line(frame, line_coordinates[0], line_coordinates[1], (255, 255, 255), 2)

#     cv2.imshow('Object Detection with Virtual Line', frame)

#     if cv2.waitKey(1) & 0xFF == ord('q'):
#         break

# cap.release()
# cv2.destroyAllWindows()

from flask import Flask, render_template, Response
import cv2
import numpy as np

app = Flask(__name__)

net = cv2.dnn.readNet("/Users/vishalchinnasamy/Desktop/Hackathons/Rajasthan Police Hackathon/its-safe-tech/backend/yolov3.weights", "/Users/vishalchinnasamy/Desktop/Hackathons/Rajasthan Police Hackathon/its-safe-tech/backend/yolo3.cfg")
layer_names = net.getUnconnectedOutLayersNames()

line_coordinates = [(100, 300), (600, 300)]


def is_above_line(point):
    x, y = point
    x1, y1 = line_coordinates[0]
    x2, y2 = line_coordinates[1]
    return (y - y1) * (x2 - x1) > (x - x1) * (y2 - y1)

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

            if confidence > 0.5 and class_id == 0:
                center_x, center_y, w, h = (obj[0:4] * np.array([width, height, width, height])).astype('int')

                cv2.rectangle(frame, (center_x - w // 2, center_y - h // 2), (center_x + w // 2, center_y + h // 2), (0, 255, 0), 2)

                if is_above_line((center_x, center_y)):
                    print("Person fully crossed or climbed above the virtual line!")

    cv2.line(frame, line_coordinates[0], line_coordinates[1], (255, 255, 255), 2)

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

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True, port=5003)
