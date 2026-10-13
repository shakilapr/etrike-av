import sqlite3
import numpy as np
import rosidl_runtime_py.utilities as u
import rclpy.serialization as s

conn = sqlite3.connect('/workspace/data/bags/etrike_loop_01_trimmed/etrike_loop_01_0.db3')
c = conn.cursor()
c.execute("SELECT data FROM messages WHERE topic_id = (SELECT id FROM topics WHERE name = '/sensing/lidar/top/pointcloud_raw_ex') LIMIT 1")
data = c.fetchone()[0]
msg = s.deserialize_message(data, u.get_message('sensor_msgs/msg/PointCloud2'))
print('FRAME_ID:', msg.header.frame_id)
print('FIELDS:', [(f.name, f.offset, f.datatype) for f in msg.fields])
print('IS_DENSE:', msg.is_dense, 'WIDTH:', msg.width, 'HEIGHT:', msg.height)
print('POINT_STEP:', msg.point_step)

pts = np.frombuffer(msg.data, dtype=np.float32).reshape(-1, msg.point_step // 4)
print('Points count:', len(pts))
print('X range:', np.nanmin(pts[:, 0]), 'to', np.nanmax(pts[:, 0]))
print('Y range:', np.nanmin(pts[:, 1]), 'to', np.nanmax(pts[:, 1]))
print('Z range:', np.nanmin(pts[:, 2]), 'to', np.nanmax(pts[:, 2]))
print('Col 4 (intensity) range:', np.nanmin(pts[:, 4]), 'to', np.nanmax(pts[:, 4]))

c.execute("SELECT data FROM messages WHERE topic_id = (SELECT id FROM topics WHERE name = '/tf_static') LIMIT 1")
tf_row = c.fetchone()
if tf_row:
    tf_msg = s.deserialize_message(tf_row[0], u.get_message('tf2_msgs/msg/TFMessage'))
    for t in tf_msg.transforms:
        print('TF_STATIC:', t.header.frame_id, '->', t.child_frame_id)
