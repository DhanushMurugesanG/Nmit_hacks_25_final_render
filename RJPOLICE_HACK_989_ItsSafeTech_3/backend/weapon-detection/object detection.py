# import cv2
# from pytorchcv import model_zoo
# import torch


# net = model_zoo.get_model('yolov3', pretrained=True)

# net.eval()

# class_names = [
#     'person','bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl',
#     'banana', 'apple', 'sandwich', 'orange',
#     'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'scissors'
# ]


# target_labels = ['fork', 'knife', 'scissors', 'cell phone']


# cap = cv2.VideoCapture(0)

# while True:
    
#     ret, frame = cap.read()
#     if not ret:
#         break

#     img = torch.from_numpy(frame.transpose((2, 0, 1))).float().div(255.0).unsqueeze(0)

 
#     with torch.no_grad():
#         prediction = net(img)

    
#     boxes, scores, indices = torch.det(bbox_and_scores=prediction, img_shape=img.shape[2:], score_threshold=0.3)

    
#     for i, (y1, x1, y2, x2) in enumerate(boxes[0].tolist()):
#         label = class_names[int(indices[0][i])]
#         score = scores[0][i].item()
#         if label in target_labels and score > 0.5:
#             print(f"{label} detected!")

    
#     for i, (y1, x1, y2, x2) in enumerate(boxes[0].tolist()):
#         label = class_names[int(indices[0][i])]
#         score = scores[0][i].item()
#         if label in target_labels and score > 0.5:
#             cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)

    
#     cv2.imshow('Object Detection', frame)

    
#     if cv2.waitKey(1) & 0xFF == ord('q'):
#         break

# cap.release()
# cv2.destroyAllWindows()


import cv2
import torch
import torchvision.models as models

# Load the YOLOv3 model from torchvision
model = models.detection.yolo3_resnet50(pretrained=True)

# Set the model to evaluation mode
model.eval()


class_names = [
    'person','bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl',
    'banana', 'apple', 'sandwich', 'orange',
    'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'scissors'
]


target_labels = ['fork', 'knife', 'scissors', 'cell phone']


cap = cv2.VideoCapture(0)

while True:
    
    ret, frame = cap.read()
    if not ret:
        break

    img = torch.from_numpy(frame.transpose((2, 0, 1))).float().div(255.0).unsqueeze(0)

 
    with torch.no_grad():
        prediction = model(img)

    
    boxes, scores, indices = torch.det(bbox_and_scores=prediction, img_shape=img.shape[2:], score_threshold=0.3)

    
    for i, (y1, x1, y2, x2) in enumerate(boxes[0].tolist()):
        label = class_names[int(indices[0][i])]
        score = scores[0][i].item()
        if label in target_labels and score > 0.5:
            print(f"{label} detected!")

    
    for i, (y1, x1, y2, x2) in enumerate(boxes[0].tolist()):
        label = class_names[int(indices[0][i])]
        score = scores[0][i].item()
        if label in target_labels and score > 0.5:
            cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)

    
    cv2.imshow('Object Detection', frame)

    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
