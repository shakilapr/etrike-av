#!/usr/bin/env python3
import time
import ctypes
import numpy as np
import tensorrt as trt

# Load libcufft / libcudart
cuda = ctypes.CDLL("libcudart.so")

cudaMalloc = cuda.cudaMalloc
cudaMalloc.argtypes = [ctypes.POINTER(ctypes.c_void_p), ctypes.c_size_t]
cudaMalloc.restype = ctypes.c_int

cudaFree = cuda.cudaFree
cudaFree.argtypes = [ctypes.c_void_p]
cudaFree.restype = ctypes.c_int

cudaMemcpy = cuda.cudaMemcpy
cudaMemcpy.argtypes = [ctypes.c_void_p, ctypes.c_void_p, ctypes.c_size_t, ctypes.c_int]
cudaMemcpy.restype = ctypes.c_int

cudaStreamCreate = cuda.cudaStreamCreate
cudaStreamCreate.argtypes = [ctypes.POINTER(ctypes.c_void_p)]
cudaStreamCreate.restype = ctypes.c_int

cudaStreamSynchronize = cuda.cudaStreamSynchronize
cudaStreamSynchronize.argtypes = [ctypes.c_void_p]
cudaStreamSynchronize.restype = ctypes.c_int

# 1. Load Engine
logger = trt.Logger(trt.Logger.WARNING)
runtime = trt.Runtime(logger)
with open("/workspace/data/ml_models/yolo26x_fp16.engine", "rb") as f:
    engine = runtime.deserialize_cuda_engine(f.read())
context = engine.create_execution_context()

# 2. Buffers
in_size = 1 * 3 * 640 * 640 * 4
out_size = 1 * 300 * 6 * 4

d_in = ctypes.c_void_p()
d_out = ctypes.c_void_p()
stream = ctypes.c_void_p()

cudaMalloc(ctypes.byref(d_in), in_size)
cudaMalloc(ctypes.byref(d_out), out_size)
cudaStreamCreate(ctypes.byref(stream))

# 3. Dummy image input
dummy_in = np.random.randn(1, 3, 640, 640).astype(np.float32)
cudaMemcpy(d_in, dummy_in.ctypes.data_as(ctypes.c_void_p), in_size, 1)

context.set_input_shape("images", (1, 3, 640, 640))
context.set_tensor_address("images", d_in.value)
context.set_tensor_address("output0", d_out.value)

# Warmup
for _ in range(5):
    context.execute_async_v3(stream.value)
cudaStreamSynchronize(stream.value)

# Benchmark 20 iterations
times = []
for _ in range(20):
    t0 = time.time()
    context.execute_async_v3(stream.value)
    cudaStreamSynchronize(stream.value)
    times.append((time.time() - t0) * 1000.0)

# Fetch output
h_out = np.empty((1, 300, 6), dtype=np.float32)
cudaMemcpy(h_out.ctypes.data_as(ctypes.c_void_p), d_out, out_size, 2)

cudaFree(d_in)
cudaFree(d_out)

print(f"YOLO26x TRT FP16 Benchmark on Jetson Orin:")
print(f"  Average Latency: {np.mean(times):.2f} ms")
print(f"  Min Latency:     {np.min(times):.2f} ms")
print(f"  Max Latency:     {np.max(times):.2f} ms")
print(f"  Effective FPS:   {1000.0 / np.mean(times):.1f} FPS")
print(f"  Output Tensor Shape: {h_out.shape}")
