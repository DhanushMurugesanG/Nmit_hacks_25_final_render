# from flask import Flask, render_template, Response
# import cv2
# import inference
# import supervision as sv

# app = Flask(__name__)

# # Annotator for bounding boxes
# annotator = sv.BoxAnnotator()

# def detect_knife(predictions, image):
#     # Check if "knife" is present in predictions
#     for prediction in predictions.get('predictions', []):
#         if prediction.get('class') == 'knife':
#             print("Knife Detected!!!!!!!!!")

#     # Annotate the image with bounding boxes
#     image = annotator.annotate(
#         scene=image, detections=sv.Detections.from_roboflow(predictions)
#     )

#     # Convert the image to RGB format (OpenCV uses BGR by default)
#     ret, jpeg = cv2.imencode('.jpg', cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
#     return jpeg.tobytes()

# def generate_frames():
#     # Create an instance of inference.Stream
#     stream = inference.Stream(
#         source=0,
#         model="knife-detection-rph/1",
#         output_channel_order="BGR",
#         use_main_thread=True,
#         on_prediction=detect_knife,
#         api_key="kgllvKP1F4mPSLr4FxcA",
#     )

#     while True:
#         # Get frame from the video stream
#         frame = stream.get_frame()

#         if frame is None:
#             break

#         # Yield the frame as bytes
#         yield (b'--frame\r\n'
#                b'Content-Type: image/jpeg\r\n\r\n' + detect_knife({}, frame) + b'\r\n')

# @app.route('/')
# def index():
#     return render_template('index.html')

# @app.route('/knife_detection')
# def video_feed():
#     return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# if __name__ == "__main__":
#     app.run(debug=True, port=5000)


import cv2
import inference
import supervision as sv

annotator = sv.BoxAnnotator()

def render(predictions, image):
    print(predictions)
    image = annotator.annotate(
        scene=image, detections=sv.Detections.from_roboflow(predictions)
    )

    cv2.imshow("Prediction", image)
    cv2.waitKey(1)

inference.Stream(
    source=0,
    model="gun-detection-ghlzd/1",
    output_channel_order="BGR",
    use_main_thread=True,
    on_prediction=render,
    api_key="wAM1zQq3gNePe5LtphIQ",
)