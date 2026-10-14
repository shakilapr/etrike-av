#!/usr/bin/env python3
import tensorrt as trt

logger = trt.Logger(trt.Logger.WARNING)
runtime = trt.Runtime(logger)
with open("/workspace/data/ml_models/yolo26x_fp16.engine", "rb") as f:
    engine = runtime.deserialize_cuda_engine(f.read())

print("SUCCESS: YOLO26x TensorRT 10.3 Engine loaded successfully!")
print(f"Number of I/O Tensors: {engine.num_io_tensors}")
for i in range(engine.num_io_tensors):
    name = engine.get_tensor_name(i)
    shape = tuple(engine.get_tensor_shape(name))
    dtype = engine.get_tensor_dtype(name)
    mode = "INPUT" if engine.get_tensor_mode(name) == trt.TensorIOMode.INPUT else "OUTPUT"
    print(f"  [{mode}] Tensor '{name}': shape={shape}, dtype={dtype}")
