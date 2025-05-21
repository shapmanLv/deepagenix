using System.Net.NetworkInformation;
using System.Security.Cryptography;
using System.Text;

namespace DeepAgenix.Common;

public class SnowflakeId
{
    private const long Twepoch = 1746028800000L;

    private const int WorkerIdBits = 5;
    private const int DatacenterIdBits = 5;
    private const int SequenceBits = 12;

    private const long MaxWorkerId = -1L ^ (-1L << WorkerIdBits);
    private const long MaxDatacenterId = -1L ^ (-1L << DatacenterIdBits);

    private const int WorkerIdShift = SequenceBits;
    private const int DatacenterIdShift = SequenceBits + WorkerIdBits;
    private const int TimestampLeftShift = SequenceBits + WorkerIdBits + DatacenterIdBits;
    private const long SequenceMask = -1L ^ (-1L << SequenceBits);

    private readonly object _lock = new();

    private long _lastTimestamp = -1L;
    private long _sequence = 0L;

    public long WorkerId { get; }
    public long DatacenterId { get; }

    public SnowflakeId(long? workerId = null, long? datacenterId = null)
    {
        WorkerId = workerId ?? GenerateWorkerId();
        DatacenterId = datacenterId ?? 0;

        if (WorkerId > MaxWorkerId || WorkerId < 0)
            throw new ArgumentException($"workerId must be between 0 and {MaxWorkerId}");

        if (DatacenterId > MaxDatacenterId || DatacenterId < 0)
            throw new ArgumentException($"datacenterId must be between 0 and {MaxDatacenterId}");
    }

    public long NextId()
    {
        lock (_lock)
        {
            var timestamp = CurrentTimeMillis();

            if (timestamp < _lastTimestamp)
                throw new InvalidOperationException("Clock moved backwards. Refusing to generate id.");

            if (timestamp == _lastTimestamp)
            {
                _sequence = (_sequence + 1) & SequenceMask;
                if (_sequence == 0)
                    timestamp = WaitForNextMillis(_lastTimestamp);
            }
            else
            {
                _sequence = 0L;
            }

            _lastTimestamp = timestamp;

            return ((timestamp - Twepoch) << TimestampLeftShift)
                   | (DatacenterId << DatacenterIdShift)
                   | (WorkerId << WorkerIdShift)
                   | _sequence;
        }
    }

    private static long WaitForNextMillis(long lastTimestamp)
    {
        long timestamp;
        do
        {
            timestamp = CurrentTimeMillis();
        } while (timestamp <= lastTimestamp);

        return timestamp;
    }

    private static long CurrentTimeMillis() => DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

    private static long GenerateWorkerId()
    {
        // 优先基于 MAC/IP/主机名 等生成
        string uniqueSource = GetHostId();

        using var sha = SHA256.Create();
        var hash = sha.ComputeHash(Encoding.UTF8.GetBytes(uniqueSource));
        return hash[0] & 0x1F; // 取低5位
    }

    private static string GetHostId()
    {
        // 容器中的 hostname 就是容器 ID；K8s 中也是唯一的 Pod 名
        var hostname = Environment.MachineName;

        // 添加 IP 和 MAC 地址信息用于增强唯一性
        var networkInfo = NetworkInterface.GetAllNetworkInterfaces()
            .Where(ni => ni.OperationalStatus == OperationalStatus.Up)
            .Select(ni => ni.GetPhysicalAddress().ToString())
            .FirstOrDefault() ?? "";

        return $"{hostname}-{networkInfo}-{Environment.ProcessId}";
    }
}

public class SnowflakeIdGenerator
{
    private static object _obj = new object();
    public static SnowflakeId? _instanse = null;
    public static SnowflakeId Instanse
    {
        get
        {
            if (_instanse is null)
                lock (_obj)
                    if (_instanse is null)
                        _instanse = new SnowflakeId();
            return _instanse;
        }
    }
}