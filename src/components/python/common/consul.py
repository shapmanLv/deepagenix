import os
import socket
import uuid

import consul


def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))  # 连接外部地址获取本机 IP
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"  # 回退默认 IP


def register_to_consul(service_name, port):
    # 获取本机 IP
    local_ip = os.getenv("IP", get_local_ip())

    # 获取 consul 配置
    consul_host = os.getenv("CONSUL_HOST")
    consul_port = os.getenv("CONSUL_PORT", "8500")
    if not consul_host:
        raise ValueError("无法获取 consul 配置")

    # 创建 Consul 客户端
    c = consul.Consul(host=consul_host, port=int(consul_port))

    # 配置健康检查（TCP 协议）
    check = consul.Check.tcp(
        host=local_ip,
        port=port,
        interval="10s",  # 检查间隔
        timeout="5s",  # 超时时间
        deregister="30s",  # 服务不可用后自动注销时间
    )

    # 注册服务
    service_id = str(uuid.uuid4())
    registration = {
        "name": service_name,
        "service_id": service_id,
        "address": local_ip,
        "port": port,
        "check": check,
    }

    try:
        c.agent.service.register(**registration)
        print(f"服务注册成功: {local_ip}:{port}")
    except Exception as e:
        print(f"注册失败: {str(e)}")
