# from flask import Flask, render_template, Response
# import cv2
# import mediapipe as mp
# import numpy as np
# mp_drawing = mp.solutions.drawing_utils
# mp_pose = mp.solutions.pose

# app = Flask(__name__)

# @app.route('/')
# def index():
#     return render_template('index.html')

# def generate_frames():
#     cap = cv2.VideoCapture(0)
#     with mp.solutions.pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
#         while True:
#             ret, frame = cap.read()

#             image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#             image.flags.writeable = False

#             results = pose.process(image)

#             image.flags.writeable = True
#             image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

#             try:
#                 landmarks = results.pose_landmarks.landmark


#                 def calculate_angle(a,b,c):
#                     a = np.array(a) # First
#                     b = np.array(b) # Mid
#                     c = np.array(c) # End
                    
#                     radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
#                     angle = np.abs(radians*180.0/np.pi)
                    
#                     if angle >180.0:
#                         angle = 360-angle
                        
#                     return angle 
                
#                 # Left elbow with left hip - coordinates 
#                 left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
#                 left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
#                 left_elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]

#                 # Right elbow with right hip - coordinates 
#                 right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
#                 right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
#                 right_elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]

#                 # Right hip and ankle - coordinates 
#                 right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
#                 right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
#                 right_ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]

#                 # Left hip and ankle - coordinates 
#                 left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
#                 left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
#                 left_ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x,landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]

#                 # Left hip with knee - coordinates 
#                 right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
#                 left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
#                 left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
                
#                 # Right hip with knee - coordinates 
#                 left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
#                 right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
#                 right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
                
#                 # Calculate angle
#                 left_elbow_hip_angle = calculate_angle(left_hip, left_shoulder, left_elbow)
#                 right_elbow_hip_angle = calculate_angle(right_hip, right_shoulder, right_elbow)
#                 left_hip_ankle_angle = calculate_angle(left_hip, left_knee, left_ankle)
#                 right_hip_ankle_angle = calculate_angle(right_hip, right_knee, right_ankle)
#                 left_hip_knee_angle = calculate_angle(right_hip, left_hip, left_knee)
#                 right_hip_knee_angle = calculate_angle(left_hip, right_hip, right_knee)

                
#                 # Visualize Left Elbow with Left Hip angle
#                 cv2.putText(image, str(left_elbow_hip_angle), 
#                             tuple(np.multiply(left_shoulder, [1280, 720]).astype(int)), 
#                             cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA
#                                     )
                
#                 # Visualize Right Elbow with Right Hip angle
#                 cv2.putText(image, str(right_elbow_hip_angle), 
#                             tuple(np.multiply(right_shoulder, [1280, 720]).astype(int)), 
#                             cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA
#                                     )
                
#                 # Visualize Left hip and ankle angle
#                 cv2.putText(image, str(left_hip_ankle_angle), 
#                             tuple(np.multiply(left_knee, [1280, 720]).astype(int)), 
#                             cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA
#                                     )
                
#                 # Visualize Right hip and ankle angle
#                 cv2.putText(image, str(right_hip_ankle_angle), 
#                             tuple(np.multiply(right_knee, [1280, 720]).astype(int)), 
#                             cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA
#                                     )
                
#                 # Visualize Left Hip with Knee
#                 cv2.putText(image, str(left_hip_knee_angle), 
#                             tuple(np.multiply(left_hip, [1280, 720]).astype(int)), 
#                             cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA
#                                     )
                
#                 # Visualize Right hip with Knee
#                 cv2.putText(image, str(right_hip_knee_angle), 
#                             tuple(np.multiply(right_hip, [1280, 720]).astype(int)), 
#                             cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA
#                                     )
                
#                 print(landmarks)
                        

#             except:
#                 pass

#             mp.solutions.drawing_utils.draw_landmarks(image, results.pose_landmarks, mp.solutions.pose.POSE_CONNECTIONS)

#             ret, jpeg = cv2.imencode('.jpg', image)
#             frame = jpeg.tobytes()

#             yield (b'--frame\r\n'
#                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# @app.route('/risky_movements')
# def video_feed():
#     return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)

# -----Perfect code below

# from flask import Flask, render_template, Response, jsonify
# from flask_cors import CORS
# import cv2
# import mediapipe as mp
# import numpy as np

# mp_drawing = mp.solutions.drawing_utils
# mp_pose = mp.solutions.pose

# app = Flask(__name__)
# CORS(app)

# # Provided threshold values
# threshold_values = {
#     "left_elbow_hip_angle": 150,
#     "left_hip_ankle_angle": 110,
#     "left_hip_knee_angle": 140,
#     "right_elbow_hip_angle": 50,
#     "right_hip_ankle_angle": 170,
#     "right_hip_knee_angle": 100
# }

# @app.route('/')
# def index():
#     return render_template('index.html')

# def calculate_angle(a, b, c):
#     a = np.array(a)  # First
#     b = np.array(b)  # Mid
#     c = np.array(c)  # End

#     radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
#     angle = np.abs(radians * 180.0 / np.pi)

#     if angle > 180.0:
#         angle = 360 - angle

#     return angle

# @app.route('/angles')
# def get_angles():
#     try:
#         cap = cv2.VideoCapture(0)
#         with mp.solutions.pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
#             ret, frame = cap.read()
#             image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#             image.flags.writeable = False

#             results = pose.process(image)

#             image.flags.writeable = True
#             image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

#             landmarks = results.pose_landmarks.landmark

#             #Left elbow with left hip - coordinates 
#             left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
#             left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
#             left_elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]

#             # Right elbow with right hip - coordinates 
#             right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
#             right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
#             right_elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]

#             # Right hip and ankle - coordinates 
#             right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
#             right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
#             right_ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]

#             # Left hip and ankle - coordinates 
#             left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
#             left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
#             left_ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x,landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]

#             # Left hip with knee - coordinates 
#             right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
#             left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
#             left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
                
#             # Right hip with knee - coordinates 
#             left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
#             right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
#             right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
                

#             left_elbow_hip_angle = calculate_angle(left_hip, left_shoulder, left_elbow)
#             right_elbow_hip_angle = calculate_angle(right_hip, right_shoulder, right_elbow)
#             left_hip_ankle_angle = calculate_angle(left_hip, left_knee, left_ankle)
#             right_hip_ankle_angle = calculate_angle(right_hip, right_knee, right_ankle)
#             left_hip_knee_angle = calculate_angle(right_hip, left_hip, left_knee)
#             right_hip_knee_angle = calculate_angle(left_hip, right_hip, right_knee)

#             # Return angles as JSON
#             angles_data = {
                # "left_elbow_hip_angle": left_elbow_hip_angle,
                # "right_elbow_hip_angle": right_elbow_hip_angle,
                # "left_hip_ankle_angle": left_hip_ankle_angle,
                # "right_hip_ankle_angle": right_hip_ankle_angle,
                # "left_hip_knee_angle": left_hip_knee_angle,
                # "right_hip_knee_angle": right_hip_knee_angle,
#             }

#             # Check for risky movements based on threshold values
#             risky_movements = {
#                 "left_elbow_hip_angle": left_elbow_hip_angle >= threshold_values["left_elbow_hip_angle"],
#                 "right_elbow_hip_angle": right_elbow_hip_angle >= threshold_values["right_elbow_hip_angle"],
#                 "left_hip_ankle_angle": left_hip_ankle_angle >= threshold_values["left_hip_ankle_angle"],
#                 "right_hip_ankle_angle": right_hip_ankle_angle >= threshold_values["right_hip_ankle_angle"],
#                 "left_hip_knee_angle": left_hip_knee_angle >= threshold_values["left_hip_knee_angle"],
#                 "right_hip_knee_angle": right_hip_knee_angle >= threshold_values["right_hip_knee_angle"],
#             }

#             # Print risky movements
#             print("Risky Movements:", risky_movements)

#             # Check if the person is climbing the wall
#             if sum(risky_movements.values()) >= 3:
#                 print("Person is climbing the wall!")
#             else:
#                 print("Not climbing")

#             return jsonify(angles_data)

#     except Exception as e:
#         return jsonify({"error": str(e)})

# def generate_frames():
#     cap = cv2.VideoCapture(0)
#     with mp.solutions.pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
#         while True:
#             ret, frame = cap.read()

#             image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#             image.flags.writeable = False

#             results = pose.process(image)

#             image.flags.writeable = True
#             image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

#             try:
#                 landmarks = results.pose_landmarks.landmark

#                 #Left elbow with left hip - coordinates 
#                 left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
#                 left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
#                 left_elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]

#                 # Right elbow with right hip - coordinates 
#                 right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
#                 right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
#                 right_elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]

#                 # Right hip and ankle - coordinates 
#                 right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
#                 right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
#                 right_ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]

#                 # Left hip and ankle - coordinates 
#                 left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
#                 left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
#                 left_ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x,landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]

#                 # Left hip with knee - coordinates 
#                 right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
#                 left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
#                 left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
                    
#                 # Right hip with knee - coordinates 
#                 left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
#                 right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
#                 right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
                    

#                 left_elbow_hip_angle = calculate_angle(left_hip, left_shoulder, left_elbow)
#                 right_elbow_hip_angle = calculate_angle(right_hip, right_shoulder, right_elbow)
#                 left_hip_ankle_angle = calculate_angle(left_hip, left_knee, left_ankle)
#                 right_hip_ankle_angle = calculate_angle(right_hip, right_knee, right_ankle)
#                 left_hip_knee_angle = calculate_angle(right_hip, left_hip, left_knee)
#                 right_hip_knee_angle = calculate_angle(left_hip, right_hip, right_knee)

#                 # Display angles on the image
#                 cv2.putText(image, f"A. Left Elbow-Hip: {left_elbow_hip_angle:.2f}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)
#                 cv2.putText(image, f"B. Right Elbow-Hip: {right_elbow_hip_angle:.2f}", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)
#                 cv2.putText(image, f"C. Left Hip-Ankle: {left_hip_ankle_angle:.2f}", (10, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)
#                 cv2.putText(image, f"D. Right Hip-Ankle: {right_hip_ankle_angle:.2f}", (10, 120), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)
#                 cv2.putText(image, f"E. Left Hip-Knee: {left_hip_knee_angle:.2f}", (10, 150), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)
#                 cv2.putText(image, f"F. Right Hip-Knee: {right_hip_knee_angle:.2f}", (10, 180), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)

#             except:
#                 pass

#             # print(landmarks)

#             mp.solutions.drawing_utils.draw_landmarks(image, results.pose_landmarks, mp.solutions.pose.POSE_CONNECTIONS)

#             ret, jpeg = cv2.imencode('.jpg', image)
#             frame = jpeg.tobytes()

#             yield (b'--frame\r\n'
#                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# @app.route('/risky_movements')
# def video_feed():
#     return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)

# -------- fix delay
    
from flask import Flask, render_template, Response, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import cv2
import mediapipe as mp
import numpy as np
import threading

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app)

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

# Provided threshold values
threshold_values = {
    "left_elbow_hip_angle": 150,
    "left_hip_ankle_angle": 110,
    "left_hip_knee_angle": 140,
    "right_elbow_hip_angle": 150,
    "right_hip_ankle_angle": 170,
    "right_hip_knee_angle": 100
}

# Shared variables for multi-threading
lock = threading.Lock()
angles_data = {}

def send_data_to_frontend(data):
    print(data)
    socketio.emit('climbing_data', {'data': data})

def calculate_angle(a, b, c):
    a = np.array(a)  # First
    b = np.array(b)  # Mid
    c = np.array(c)  # End

    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)

    if angle > 180.0:
        angle = 360 - angle

    return angle

def process_pose(frame):
    global angles_data

    with mp.solutions.pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False

        results = pose.process(image)

        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        landmarks = results.pose_landmarks.landmark

        # Left elbow with left hip - coordinates 
        left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
        left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
        left_elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]

        # Right elbow with right hip - coordinates 
        right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
        right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
        right_elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]

        # Right hip and ankle - coordinates 
        right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
        right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
        right_ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]

        # Left hip and ankle - coordinates 
        left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
        left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
        left_ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x,landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]

        # Left hip with knee - coordinates 
        right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
        left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
        left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
                
        # Right hip with knee - coordinates 
        left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
        right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
        right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
        
        # Calculate angles 
        left_elbow_hip_angle = calculate_angle(left_hip, left_shoulder, left_elbow)
        right_elbow_hip_angle = calculate_angle(right_hip, right_shoulder, right_elbow)
        left_hip_ankle_angle = calculate_angle(left_hip, left_knee, left_ankle)
        right_hip_ankle_angle = calculate_angle(right_hip, right_knee, right_ankle)
        left_hip_knee_angle = calculate_angle(right_hip, left_hip, left_knee)
        right_hip_knee_angle = calculate_angle(left_hip, right_hip, right_knee)

        # Update angles_data
        lock.acquire()
        angles_data = {
            "left_elbow_hip_angle": left_elbow_hip_angle,
            "right_elbow_hip_angle": right_elbow_hip_angle,
            "left_hip_ankle_angle": left_hip_ankle_angle,
            "right_hip_ankle_angle": right_hip_ankle_angle,
            "left_hip_knee_angle": left_hip_knee_angle,
            "right_hip_knee_angle": right_hip_knee_angle,
        }
        lock.release()

        # Check for risky movements based on threshold values
        risky_movements = {
            "left_elbow_hip_angle": left_elbow_hip_angle >= threshold_values["left_elbow_hip_angle"],
            "right_elbow_hip_angle": right_elbow_hip_angle >= threshold_values["right_elbow_hip_angle"],
            "left_hip_ankle_angle": left_hip_ankle_angle >= threshold_values["left_hip_ankle_angle"],
            "right_hip_ankle_angle": right_hip_ankle_angle >= threshold_values["right_hip_ankle_angle"],
            "left_hip_knee_angle": left_hip_knee_angle >= threshold_values["left_hip_knee_angle"],
            "right_hip_knee_angle": right_hip_knee_angle >= threshold_values["right_hip_knee_angle"],
        }

        # Print risky movements
        print("Risky Movements:", risky_movements)

        # Check if the person is climbing the wall
        if sum(risky_movements.values()) >= 3:
            # send_data_to_frontend(True)
            print("Climbing")
        else:
            # send_data_to_frontend(False)
            print("Not Climbing")

        with app.app_context():
            return jsonify(angles_data)

def generate_frames():
    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()

        # Perform pose estimation and angle calculation in a separate thread
        pose_thread = threading.Thread(target=process_pose, args=(frame,))
        pose_thread.start()

        # Display the frame
        try:
           with mp.solutions.pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
                image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                image.flags.writeable = False

                results = pose.process(image)

                image.flags.writeable = True
                image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

                landmarks = results.pose_landmarks.landmark

                #Left elbow with left hip - coordinates 
                left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
                left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
                left_elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]

                    # Right elbow with right hip - coordinates 
                right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
                right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
                right_elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]

                    # Right hip and ankle - coordinates 
                right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
                right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
                right_ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]

                    # Left hip and ankle - coordinates 
                left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
                left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
                left_ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x,landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]

                    # Left hip with knee - coordinates 
                right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
                left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
                left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
                        
                    # Right hip with knee - coordinates 
                left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
                right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
                right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
                        

                left_elbow_hip_angle = calculate_angle(left_hip, left_shoulder, left_elbow)
                right_elbow_hip_angle = calculate_angle(right_hip, right_shoulder, right_elbow)
                left_hip_ankle_angle = calculate_angle(left_hip, left_knee, left_ankle)
                right_hip_ankle_angle = calculate_angle(right_hip, right_knee, right_ankle)
                left_hip_knee_angle = calculate_angle(right_hip, left_hip, left_knee)
                right_hip_knee_angle = calculate_angle(left_hip, right_hip, right_knee)

                # Display angles on the image
                cv2.putText(image, f"A. Left Elbow-Hip: {left_elbow_hip_angle:.2f}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)
                cv2.putText(image, f"B. Right Elbow-Hip: {right_elbow_hip_angle:.2f}", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)
                cv2.putText(image, f"C. Left Hip-Ankle: {left_hip_ankle_angle:.2f}", (10, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)
                cv2.putText(image, f"D. Right Hip-Ankle: {right_hip_ankle_angle:.2f}", (10, 120), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)
                cv2.putText(image, f"E. Left Hip-Knee: {left_hip_knee_angle:.2f}", (10, 150), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)
                cv2.putText(image, f"F. Right Hip-Knee: {right_hip_knee_angle:.2f}", (10, 180), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)


        except:
            pass

        mp.solutions.drawing_utils.draw_landmarks(image, results.pose_landmarks, mp.solutions.pose.POSE_CONNECTIONS)

        ret, jpeg = cv2.imencode('.jpg', image)
        frame = jpeg.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/angles')
def get_angles():
    global angles_data

    # Return angles as JSON
    return jsonify(angles_data)

@app.route('/risky_movements')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    # Run the Flask app with SocketIO support
    socketio.run(app, debug=True, port=5555)
