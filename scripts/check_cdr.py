import sqlite3
import struct

conn = sqlite3.connect('/dev/shm/etrike_loop_01_trimmed/etrike_loop_01_0.db3')
c = conn.cursor()
c.execute("SELECT timestamp, data FROM messages WHERE topic_id = (SELECT id FROM topics WHERE name = '/sensing/lidar/top/pointcloud_raw_ex') LIMIT 1")
ts, data = c.fetchone()
sec, nsec = struct.unpack('<II', data[4:12])
print('Row timestamp:', ts, '-> sec:', ts // 1000000000, 'nsec:', ts % 1000000000)
print('CDR stamp:    sec:', sec, 'nsec:', nsec)
print('Total data bytes in SQLite:', len(data))
