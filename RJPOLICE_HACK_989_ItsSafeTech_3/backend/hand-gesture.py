# import mediapipe as mp
# import cv2
# import numpy as np
# import uuid
# import os

# mp_drawing = mp.solutions.drawing_utils
# mp_hands = mp.solutions.hands

# cap = cv2.VideoCapture(0)

# with mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.2) as hands:
 
#     while cap.isOpened():
#         ret, frame = cap.read()
        
#         # BGR 2 RGB
#         image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
#         # Flip on horizontal
#         image = cv2.flip(image, 1)
        
#         # Set flag
#         image.flags.writeable = False
        
#         # Detections
#         results = hands.process(image)
        
#         # Set flag to true
#         image.flags.writeable = True
        
#         # RGB 2 BGR
#         image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        
#         # Detections
#         print(results)
        
#         # Rendering results
#         if results.multi_hand_landmarks:
#             for num, hand in enumerate(results.multi_hand_landmarks):
#                 mp_drawing.draw_landmarks(image, hand, mp_hands.HAND_CONNECTIONS, 
#                                         mp_drawing.DrawingSpec(color=(121, 22, 76), thickness=2, circle_radius=4),
#                                         mp_drawing.DrawingSpec(color=(250, 44, 250), thickness=2, circle_radius=2),
#                                          )
            
#         # Save our image    
#         cv2.imwrite(os.path.join('/Users/vishalchinnasamy/Desktop/Hackathons/Rajasthan Police Hackathon/its-safe-tech/backend/hand-gest-save-img', '{}.jpg'.format(uuid.uuid1())), image)
#         cv2.imshow('Hand Tracking', image)

#         if cv2.waitKey(10) & 0xFF == ord('q'):
#             break

# cap.release()
# cv2.destroyAllWindows()

# --------------

# import cv2
# import mediapipe as mp

# def run_gesture_recognition(video_capture):
#     # Replace '/absolute/path/to/gesture_recognizer.task' with the actual path to your .task file
#     model_path = '/Users/vishalchinnasamy/Desktop/Hackathons/Rajasthan Police Hackathon/RJPOLICE_HACK_989_ItsSafeTech_3/backend/gesture_recognizer.task'

#     # Create a Gesture Recognizer instance
#     hands = mp.solutions.hands.Hands()
#     gesture_recognizer = hands.Hands(static_image_mode=False, max_num_hands=2)

#     try:
#         while True:
#             # Read a frame from the webcam
#             ret, frame = video_capture.read()
#             if not ret:
#                 print("Failed to capture frame. Exiting...")
#                 break

#             # Convert BGR image to RGB
#             rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

#             # Process the frame using the gesture recognizer
#             results = gesture_recognizer.process(rgb_frame)

#             # Handle the results as needed
#             if results.multi_handedness:
#                 for idx, handedness in enumerate(results.multi_handedness):
#                     print(f"Hand {idx + 1} - {handedness.classification[0].label}")

#             # Display the frame
#             cv2.imshow("Gesture Recognition", cv2.cvtColor(rgb_frame, cv2.COLOR_RGB2BGR))

#             # Break the loop if 'q' is pressed
#             if cv2.waitKey(1) & 0xFF == ord('q'):
#                 break

#     except Exception as e:
#         print(f"Error: {e}")

#     finally:
#         # Release the video capture and close the gesture recognizer
#         video_capture.release()
#         cv2.destroyAllWindows()
#         gesture_recognizer.close()

# # Open the webcam
# video_capture = cv2.VideoCapture(0)

# # Check if the webcam is opened successfully
# if not video_capture.isOpened():
#     print("Error: Couldn't open the webcam.")
# else:
#     run_gesture_recognition(video_capture)

# --------- working below

# import cv2
# import mediapipe as mp

# def run_gesture_recognition(video_capture):
#     # Replace '/absolute/path/to/gesture_recognizer.task' with the actual path to your .task file
#     model_path = '/Users/vishalchinnasamy/Desktop/Hackathons/Rajasthan Police Hackathon/RJPOLICE_HACK_989_ItsSafeTech_3/backend/gesture_recognizer.task'

#     # Create a Gesture Recognizer instance
#     gesture_recognizer = mp.solutions.hands.Hands(static_image_mode=False, max_num_hands=2)

#     try:
#         while True:
#             # Read a frame from the webcam
#             ret, frame = video_capture.read()
#             if not ret:
#                 print("Failed to capture frame. Exiting...")
#                 break

#             # Convert BGR image to RGB
#             rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

#             # Process the frame using the gesture recognizer
#             results = gesture_recognizer.process(rgb_frame)

#             # Handle the results as needed
#             if results.multi_handedness:
#                 for idx, handedness in enumerate(results.multi_handedness):
#                     print(f"Hand {idx + 1} - {handedness.classification[0].label}")
                    
#             # Display the frame
#             image = cv2.cvtColor(rgb_frame, cv2.COLOR_RGB2BGR)
#             cv2.imshow("Gesture Recognition", image)

#             # Break the loop if 'q' is pressed
#             if cv2.waitKey(1) & 0xFF == ord('q'):
#                 break

#     except Exception as e:
#         print(f"Error: {e}")

#     finally:
#         # Release the video capture and close the gesture recognizer
#         video_capture.release()
#         cv2.destroyAllWindows()
#         gesture_recognizer.close()

# # Open the webcam
# video_capture = cv2.VideoCapture(0)

# # Check if the webcam is opened successfully
# if not video_capture.isOpened():
#     print("Error: Couldn't open the webcam.")
# else:
#     run_gesture_recognition(video_capture)

# -----------
import cv2
import mediapipe as mp

def map_to_rps(hand_label):
    if hand_label == "Open":
        return "Rock"
    elif hand_label == "Closed":
        return "Paper"
    else:
        return "Scissors"

def run_gesture_recognition(video_capture):
    model_path = '/Users/vishalchinnasamy/Desktop/Hackathons/Rajasthan Police Hackathon/RJPOLICE_HACK_989_ItsSafeTech_3/backend/gesture_recognizer.task'
    hands = mp.solutions.hands.Hands(static_image_mode=False, max_num_hands=2)

    try:
        while True:
            ret, frame = video_capture.read()
            if not ret:
                print("Failed to capture frame. Exiting...")
                break

            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = hands.process(rgb_frame)

            if results.multi_handedness:
                for idx, handedness in enumerate(results.multi_handedness):
                    hand_label = handedness.classification[0].label
                    print(f"Hand {idx + 1} - {hand_label}")

                    # Map hand gestures to rock, paper, scissors moves
                    rps_move = map_to_rps(hand_label)
                    print(f"Move: {rps_move}")

            image = cv2.cvtColor(rgb_frame, cv2.COLOR_RGB2BGR)
            cv2.imshow("Gesture Recognition", image)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    except Exception as e:
        print(f"Error: {e}")

    finally:
        video_capture.release()
        cv2.destroyAllWindows()
        hands.close()

video_capture = cv2.VideoCapture(0)

if not video_capture.isOpened():
    print("Error: Couldn't open the webcam.")
else:
    run_gesture_recognition(video_capture)
