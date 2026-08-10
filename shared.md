ssh -N -L 8385:127.0.0.1:8384 med1@172.16.25.56


http://127.0.0.1:8385

med1@ubuntu:~$ ssh -N -L 8385:127.0.0.1:8384 med1@172.16.25.56
The authenticity of host '172.16.25.56 (172.16.25.56)' can't be established.
ED25519 key fingerprint is SHA256:U8Z34y+aXlxr9/Gp0/K76VYsxDbKZfm9tmolw4LSmO0.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '172.16.25.56' (ED25519) to the list of known hosts.
med1@172.16.25.56's password: 


