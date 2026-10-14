import tensorrt as trt

logger = trt.Logger(trt.Logger.WARNING)
runtime = trt.Runtime(logger)
with open("/workspace/data/ml_models/rtmpose_s_fp16.engine", "rb") as f:
    engine = runtime.deserialize_cuda_engine(f.read())

print(f"Num IO Tensors: {engine.num_io_tensors}")
for i in range(engine.num_io_tensors):
    name = engine.get_tensor_name(i)
    mode = engine.get_tensor_mode(name)
    shape = engine.get_tensor_shape(name)
    dtype = engine.get_tensor_dtype(name)
    print(f"[{i}] Name: {name:15s} | Mode: {mode} | Shape: {shape} | Dtype: {dtype}")
