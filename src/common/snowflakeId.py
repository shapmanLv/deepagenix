import hashlib
import os
import threading
import time
from typing import Final

import psutil


class SnowflakeGenerator:
    """
    雪花id生成器（改良版），代码参考自 seata：
    (https://github.com/apache/incubator-seata/blob/2.x/common/src/main/java/org/apache/seata/common/util/IdWorker.java)

    ID结构示意图（64位）：
        0 (隐式高位) | worker_id(10bit) | time_incr(41bit) | sequence(12bit)

    改良点：
        1、调换了机器id和时间戳的位置（这样有利于数据库页分裂）
        2、只会在初始化时获取时间戳，之后我不会再依赖系统时间生成id，当sequence达到最大值进行重置时，时间戳会做加一操作
        
        第二点这里有一些隐患，就是id生成太快，超过了一毫秒4096这个阈值时，时间就会超前，正常情况下系统不可能有这么高并发
        但是如果是一些刷数脚本呢，比如提前先疯狂生成一些id，或者批量插入时准备数据库插入数据逻辑不复杂，速度非常快，没有其他业务纠缠

    使用示例：
        from src.common.snowflakeId import SnowflakeGenerator
        generator = SnowflakeGenerator()
        id = generator.generate()
    """

    # ===== 位分配常量 =====
    WORKER_BITS: Final[int] = 10  # 工作节点ID位数（最多1024节点）
    TIME_BITS: Final[int] = 41  # 时间戳增量位数（约69年范围）
    SEQ_BITS: Final[int] = 12  # 序列号位数（每毫秒4096个ID）

    # ===== 位移计算 =====
    WORKER_SHIFT: Final[int] = TIME_BITS + SEQ_BITS  # 10+41+12=63位
    TIME_SHIFT: Final[int] = SEQ_BITS  # 序列号右移位数

    # ===== 极值校验 =====
    MAX_WORKER_ID: Final[int] = (1 << WORKER_BITS) - 1  # 1023
    MAX_SEQUENCE: Final[int] = (1 << SEQ_BITS) - 1  # 4095
    MAX_TIME: Final[int] = (1 << TIME_BITS) - 1  # 2199023255551

    _instance = None
    _lock = threading.Lock()

    def __new__(cls, *args, **kwargs):
        """双重校验锁单例实现"""
        if not cls._instance:
            with cls._lock:
                if not cls._instance:
                    instance = super().__new__(cls)
                    # 初始化基准时间（确保精度为毫秒）
                    instance.sequence = 0
                    instance.last_time = int(
                        time.time() * 1000 - 1740240000000
                    )  # 2025/2/13 00:00:00
                    instance.worker_id = cls._gen_worker_id()
                    cls._instance = instance
        return cls._instance

    def __init__(self):
        pass

    @classmethod
    def _get_host_uid(self):
        """物理机唯一标识"""
        # 使用TPM芯片指纹（需root权限）
        try:
            with open("/sys/class/tpm/tpm0/device/hwid") as f:
                return f.read().strip()
        except FileNotFoundError:
            # 回退到主板UUID
            return os.popen("dmidecode -s baseboard-serial-number").read().strip()

    @classmethod
    def _get_container_id(self):
        """容器环境检测"""
        try:
            with open("/proc/self/cgroup", "r") as f:
                for line in f:
                    if "docker" in line:
                        return line.strip().split("/")[-1]
        except FileNotFoundError:
            return None

    @classmethod
    def _get_process_uid(self):
        """进程级唯一指纹生成"""
        # 组合进程PID+启动时间戳+监听端口（如果有）
        proc = psutil.Process()
        ports = [
            conn.laddr.port
            for conn in proc.net_connections()
            if conn.status == "LISTEN"
        ]
        return f"{proc.pid}_{proc.create_time()}_{'-'.join(map(str, ports))}"

    @classmethod
    def _get_k8s_id(self):
        """Kubernetes环境专用标识"""
        # 通过StatefulSet的稳定标识获取
        return os.getenv("POD_STABLE_ID") or os.getenv("HOSTNAME")  # 修复缺失方法

    @classmethod
    def _gen_worker_id(self):
        """量子安全WorkerID生成策略"""
        # 层级式ID生成策略
        sources = [
            self._get_k8s_id(),  # K8s环境唯一标识
            self._get_container_id(),  # 容器环境标识
            self._get_host_uid(),  # 物理机指纹
            self._get_process_uid(),  # 进程级标识
        ]

        # 哈希压缩（SHA3-512截断）
        hybrid_id = "|".join(filter(None, sources))
        hashed = hashlib.shake_128(hybrid_id.encode()).digest(8)  # 64位摘要
        return int.from_bytes(hashed, "big") % (1 << self.WORKER_BITS)

    def generate(self) -> int:
        """生成id"""
        with self._lock:
            # 序列号溢出处理（自动进位）
            if self.sequence > self.MAX_SEQUENCE:
                self.sequence = 0
                self.last_time += 1  # 时间戳模拟自增

            # 实时检测时间戳溢出（避免系统长期运行导致错误）
            if self.last_time > self.MAX_TIME:
                raise OverflowError("时间戳溢出，请重新初始化生成器")

            # ID组件组装（位操作优化）
            worker_part = self.worker_id << self.WORKER_SHIFT  # 左移53位
            time_part = self.last_time << self.TIME_SHIFT  # 左移12位
            snowflake_id = worker_part | time_part | self.sequence

            self.sequence += 1  # 原子操作更新序列号
            return snowflake_id

    def extract_timestamp(self, snowflake_id: int) -> int:
        """从id中提取出时间戳"""
        # 创建时间戳位掩码（清除worker和sequence部分）
        time_mask = (
            0x000FFFFFFFFFF000  # 二进制：0000 0000...1111 1111 1111 1111 0000 0000 0000
        )
        # 应用掩码并右移复位
        raw_time = (snowflake_id & time_mask) >> 12

        return int(raw_time + 1740240000000)

    @property
    def config(self) -> dict:
        """返回当前生成器配置状态"""
        return {
            "worker_id": self.worker_id,
            "current_time": self.last_time,
            "sequence": self.sequence,
        }
