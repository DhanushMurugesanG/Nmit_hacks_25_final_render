# import cv2
# from simple_facerec import SimpleFacerec

# sfr = SimpleFacerec()
# sfr.load_encoding_images("face-recognition/images/")

# cap = cv2.VideoCapture(0)

# while True:
#     ret, frame = cap.read()

#     # Detect Faces
#     face_locations, face_names = sfr.detect_known_faces(frame)
#     for face_loc, name in zip(face_locations, face_names):
#         y1, x2, y2, x1 = face_loc[0], face_loc[1], face_loc[2], face_loc[3]

#         cv2.putText(frame, name,(x1, y1 - 10), cv2.FONT_HERSHEY_DUPLEX, 1, (0, 0, 200), 2)
#         cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 200), 4)

#     cv2.imshow("Frame", frame)

#     key = cv2.waitKey(1)
#     if key == 27:
#         break

# cap.release()
# cv2.destroyAllWindows()

from flask import Flask, render_template, Response
import cv2
from simple_facerec import SimpleFacerec
import paho.mqtt.client as mqtt

broker_address = "077e21ca882d4a56bb464f14b02da035.s2.eu.hivemq.cloud"
broker_port = 8884  # Default port for MQTT over WebSocket

# Define topics
topic = "test"

def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    client.subscribe(topic)

def on_message(client, userdata, msg):
    print(f"Received message on topic {msg.topic}: {msg.payload.decode()}")


client = mqtt.Client(transport="websockets")
client.on_connect = on_connect
client.on_message = on_message


client.connect(broker_address, port=broker_port, keepalive=60)
app = Flask(__name__)
sfr = SimpleFacerec()
sfr.load_encoding_images("face-recognition/images/")

def generate_frames():
    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()

        # Detect Faces
        face_locations, face_names = sfr.detect_known_faces(frame)
        for face_loc, name in zip(face_locations, face_names):
            y1, x2, y2, x1 = face_loc[0], face_loc[1], face_loc[2], face_loc[3]

            if name == "Sasi":
                print("Unknown!!")
                client.publish(topic, "Hello, MQTT!")

            cv2.putText(frame, name, (x1, y1 - 10), cv2.FONT_HERSHEY_DUPLEX, 1, (0, 0, 200), 2)
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 200), 4)

        ret, jpeg = cv2.imencode('.jpg', frame)
        frame = jpeg.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/face_recog')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
