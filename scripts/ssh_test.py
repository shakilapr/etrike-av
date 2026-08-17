import paramiko
import sys
import time

def ssh_connect_and_run(host, username, password, commands, timeout=30):
    """Connect to SSH and run commands"""
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        print(f"Connecting to {host}...")
        client.connect(host, username=username, password=password, timeout=timeout)
        print("Connected!")
        
        # Run commands
        for cmd in commands:
            print(f"\n>>> Running: {cmd}")
            stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout)
            
            # Get output
            output = stdout.read().decode('utf-8')
            error = stderr.read().decode('utf-8')
            
            if output:
                print(output)
            if error:
                print(f"STDERR: {error}", file=sys.stderr)
            
            # Wait a bit between commands
            time.sleep(1)
        
        return True
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return False
    finally:
        client.close()

if __name__ == "__main__":
    # Test connection
    host = "172.16.25.56"
    username = "med1"
    password = "med1"
    
    # Simple test commands
    test_commands = [
        "echo 'Connection successful'",
        "hostname",
        "uname -a",
        "ls -la ~/av_project/"
    ]
    
    success = ssh_connect_and_run(host, username, password, test_commands)
    sys.exit(0 if success else 1)
