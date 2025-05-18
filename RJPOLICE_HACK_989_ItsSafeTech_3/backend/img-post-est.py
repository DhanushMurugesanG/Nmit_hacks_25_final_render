# from flask import Flask, render_template, Response, jsonify
# from flask_cors import CORS
# import cv2
# import mediapipe as mp
# import numpy as np

# mp_drawing = mp.solutions.drawing_utils
# mp_pose = mp.solutions.pose

# app = Flask(__name__)
# CORS(app)

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
#         # Load image directly from file path
#         image_path = '/Users/vishalchinnasamy/Desktop/Hackathons/Rajasthan Police Hackathon/RJPOLICE_HACK_989_ItsSafeTech_3/backend/wall-climbing.jpeg'
#         img = cv2.imread(image_path)

#         with mp.solutions.pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
#             image = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
#             image.flags.writeable = False

#             results = pose.process(image)

#             image.flags.writeable = True
#             image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

#             landmarks = results.pose_landmarks.landmark

#             # Left elbow with left hip - coordinates
#             left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
#             left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
#                              landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
#             left_elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]

#             # Right elbow with right hip - coordinates
#             right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
#             right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,
#                               landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
#             right_elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]

#             # Right hip and ankle - coordinates
#             right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
#             right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
#             right_ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x,
#                            landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]

#             # Left hip and ankle - coordinates
#             left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
#             left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
#             left_ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]

#             # Left hip with knee - coordinates
#             right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
#             left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
#             left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]

#             # Right hip with knee - coordinates
#             left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
#             right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
#             right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]

#             left_elbow_hip_angle = calculate_angle(left_hip, left_shoulder, left_elbow)
#             right_elbow_hip_angle = calculate_angle(right_hip, right_shoulder, right_elbow)
#             left_hip_ankle_angle = calculate_angle(left_hip, left_knee, left_ankle)
#             right_hip_ankle_angle = calculate_angle(right_hip, right_knee, right_ankle)
#             left_hip_knee_angle = calculate_angle(right_hip, left_hip, left_knee)
#             right_hip_knee_angle = calculate_angle(left_hip, right_hip, right_knee)

#             # Print angles to terminal
#             print("Left Elbow-Hip Angle:", left_elbow_hip_angle)
#             print("Right Elbow-Hip Angle:", right_elbow_hip_angle)
#             print("Left Hip-Ankle Angle:", left_hip_ankle_angle)
#             print("Right Hip-Ankle Angle:", right_hip_ankle_angle)
#             print("Left Hip-Knee Angle:", left_hip_knee_angle)
#             print("Right Hip-Knee Angle:", right_hip_knee_angle)

#             return jsonify({
#                 "left_elbow_hip_angle": left_elbow_hip_angle,
#                 "right_elbow_hip_angle": right_elbow_hip_angle,
#                 "left_hip_ankle_angle": left_hip_ankle_angle,
#                 "right_hip_ankle_angle": right_hip_ankle_angle,
#                 "left_hip_knee_angle": left_hip_knee_angle,
#                 "right_hip_knee_angle": right_hip_knee_angle,
#             })

#     except Exception as e:
#         return jsonify({"error": str(e)})

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)

# ------------------below working

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
#         # Load image directly from file path
#         image_path = '/Users/vishalchinnasamy/Desktop/Hackathons/Rajasthan Police Hackathon/RJPOLICE_HACK_989_ItsSafeTech_3/backend/climbing2.jpeg'
#         img = cv2.imread(image_path)

#         with mp.solutions.pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
#             image = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
#             image.flags.writeable = False

#             results = pose.process(image)

#             image.flags.writeable = True
#             image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

#             landmarks = results.pose_landmarks.landmark

#             # Left elbow with left hip - coordinates
#             left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
#             left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
#                              landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
#             left_elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]

#             # Right elbow with right hip - coordinates
#             right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
#             right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,
#                               landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
#             right_elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]

#             # Right hip and ankle - coordinates
#             right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
#             right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
#             right_ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x,
#                            landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]

#             # Left hip and ankle - coordinates
#             left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
#             left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
#             left_ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]

#             # Left hip with knee - coordinates
#             right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
#             left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
#             left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]

#             # Right hip with knee - coordinates
#             left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
#             right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
#             right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]

#             left_elbow_hip_angle = calculate_angle(left_hip, left_shoulder, left_elbow)
#             right_elbow_hip_angle = calculate_angle(right_hip, right_shoulder, right_elbow)
#             left_hip_ankle_angle = calculate_angle(left_hip, left_knee, left_ankle)
#             right_hip_ankle_angle = calculate_angle(right_hip, right_knee, right_ankle)
#             left_hip_knee_angle = calculate_angle(right_hip, left_hip, left_knee)
#             right_hip_knee_angle = calculate_angle(left_hip, right_hip, right_knee)

#             # Print angles to terminal
#             print("Left Elbow-Hip Angle:", left_elbow_hip_angle)
#             print("Right Elbow-Hip Angle:", right_elbow_hip_angle)
#             print("Left Hip-Ankle Angle:", left_hip_ankle_angle)
#             print("Right Hip-Ankle Angle:", right_hip_ankle_angle)
#             print("Left Hip-Knee Angle:", left_hip_knee_angle)
#             print("Right Hip-Knee Angle:", right_hip_knee_angle)

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

#             return jsonify(risky_movements)

#     except Exception as e:
#         return jsonify({"error": str(e)})

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)

from flask import Flask, render_template, Response, jsonify
from flask_cors import CORS
import cv2
import mediapipe as mp
import numpy as np

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

app = Flask(__name__)
CORS(app)

# Provided threshold values
threshold_values = {
    "left_elbow_hip_angle": 150,
    "left_hip_ankle_angle": 110,
    "left_hip_knee_angle": 140,
    "right_elbow_hip_angle": 50,
    "right_hip_ankle_angle": 170,
    "right_hip_knee_angle": 100
}

@app.route('/')
def index():
    return render_template('index.html')

def calculate_angle(a, b, c):
    a = np.array(a)  # First
    b = np.array(b)  # Mid
    c = np.array(c)  # End

    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)

    if angle > 180.0:
        angle = 360 - angle

    return angle

@app.route('/angles')
def get_angles():
    try:
        # Load image directly from file path
        image_path = '/Users/vishalchinnasamy/Desktop/Hackathons/Rajasthan Police Hackathon/RJPOLICE_HACK_989_ItsSafeTech_3/backend/standing.jpeg'
        img = cv2.imread(image_path)

        with mp.solutions.pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
            image = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            image.flags.writeable = False

            results = pose.process(image)

            image.flags.writeable = True
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

            landmarks = results.pose_landmarks.landmark

            # Left elbow with left hip - coordinates
            left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
            left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                             landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
            left_elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]

            # Right elbow with right hip - coordinates
            right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
            right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,
                              landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
            right_elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]

            # Right hip and ankle - coordinates
            right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
            right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
            right_ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x,
                           landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]

            # Left hip and ankle - coordinates
            left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
            left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
            left_ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]

            # Left hip with knee - coordinates
            right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
            left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
            left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]

            # Right hip with knee - coordinates
            left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
            right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
            right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]

            left_elbow_hip_angle = calculate_angle(left_hip, left_shoulder, left_elbow)
            right_elbow_hip_angle = calculate_angle(right_hip, right_shoulder, right_elbow)
            left_hip_ankle_angle = calculate_angle(left_hip, left_knee, left_ankle)
            right_hip_ankle_angle = calculate_angle(right_hip, right_knee, right_ankle)
            left_hip_knee_angle = calculate_angle(right_hip, left_hip, left_knee)
            right_hip_knee_angle = calculate_angle(left_hip, right_hip, right_knee)


            # Print angles to terminal
            print("Left Elbow-Hip Angle:", left_elbow_hip_angle)
            print("Right Elbow-Hip Angle:", right_elbow_hip_angle)
            print("Left Hip-Ankle Angle:", left_hip_ankle_angle)
            print("Right Hip-Ankle Angle:", right_hip_ankle_angle)
            print("Left Hip-Knee Angle:", left_hip_knee_angle)
            print("Right Hip-Knee Angle:", right_hip_knee_angle)

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
                print("Person is climbing the wall!")
            else:
                print("Not climbing")

            return jsonify(risky_movements)

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)


